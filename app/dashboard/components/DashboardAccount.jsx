'use client'
import { Card, CardBody, CardHeader, CardFooter, Divider, Tabs, Tab, Spinner } from "@nextui-org/react"
import { useState, useEffect, useRef } from "react";
import { getElectricStandingCharges, getElectricUnitRates, getGasStandingCharges, getGasUnitRates, getGasUsage, getElectricUsage } from "@/app/actions/octopus";
import { calculateElectric, calculateGas, add } from "@/app/actions/calculations";
import Chart from "chart.js/auto";

export default function DashboardAccount(props) {
    const [account, setAccount] = useState(props.account);
    const [period, setPeriod] = useState(periods.currentMonth);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        setLoading(true);
        getData(account, period, setLoading).then(account => {
            setAccount(account);
        });
    }, [period]);

    useEffect(() => {

        if (!account.totals) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Electric', 'Gas'],
                datasets: [{
                    label: 'Cost',
                    data: [account.totals?.electric, account.totals?.gas],
                    backgroundColor: [
                        'rgba(71, 205, 120, 1)',
                        'rgba(92, 156, 234, 1)',
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: 'white',
            }
        });
    }, [account]);

    return (
        <Card className="bg-default-100">
            <CardHeader className="flex gap-2 justify-between flex-wrap">
                <h2>{account.name}</h2>
                <Tabs
                    variant="bordered"
                    selectedKey={period}
                    onSelectionChange={setPeriod}
                >
                    {Object.keys(periods).map((key) => (
                        <Tab key={key} title={periods[key].name} />
                    ))}
                </Tabs>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex justify-between gap-6">
                    <div>Electric:</div>
                    <div className="text-green-400 flex items-center">{loading ? <Spinner size="sm" /> : '£' + account.totals?.electric.toFixed(2)}</div>
                </div>
                <div className="flex justify-between gap-6">
                    <div>Gas:</div>
                    <div className="text-blue-400 flex items-center">{loading ? <Spinner size="sm" /> : '£' + account.totals?.gas.toFixed(2)}</div>
                </div>
                <div className="flex justify-between gap-6 mt-2">
                    <div>Total:</div>
                    <div className="flex items-center">{loading ? <Spinner size="sm" /> : '£' + add(account.totals?.electric, account.totals?.gas)}</div>
                </div>
                <Divider className="mt-3" />

                <div className="h-64 w-64 mx-auto flex justify-center items-center">
                    {loading ? <Spinner /> : <canvas ref={chartRef} width="400" height="400"></canvas>}
                </div>
                <Divider className="my-3" />
                <div>
                    <h3>Properties</h3>
                    <ul>
                        {account.properties.map(property => (
                            <li className="capitalize text-sm" key={property.id}>
                                <div className="flex gap-4">
                                    <div>{property.addressLine1.toLowerCase()}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardBody>
            <Divider className="my-3" />
            <CardFooter>

            </CardFooter>
        </Card>
    )
}

function lastMonth28() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(28);
    date.setMonth(date.getMonth() - 1);
    return date;
}

function begginingOfYear() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
    date.setMonth(0);
    return date;
}

function begginingOfLastYear() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(date.getFullYear() - 1);
    return date;
}

function endOfLastYear() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(31);
    date.setMonth(11);
    date.setFullYear(date.getFullYear() - 1);
    return date;
}

const periods = {
    currentMonth: {
        dateFrom: lastMonth28().toISOString(),
        dateTo: new Date().toISOString(),
        group: 'day',
        name: 'Current Month',
    },
    currentYear: {
        dateFrom: begginingOfYear().toISOString(),
        dateTo: new Date().toISOString(),
        group: 'month',
        name: 'Current Year',
    },
    lastYear: {
        dateFrom: begginingOfLastYear().toISOString(),
        dateTo: endOfLastYear().toISOString(),
        group: 'month',
        name: 'Last Year',
    }
}

async function getData(account, p, setLoading) {
    const period = periods[p]

    if (!period?.dateFrom || !period?.dateTo) {
        return account;
    }

    const electricUnitRates = await getElectricUnitRates(
        account.product_code.code,
        `E${account.product_code.tariff_code}${account.area_code.group_id}`,
        period.dateFrom,
        period.dateTo,
    );

    const electricStandingCharges = await getElectricStandingCharges(
        account.product_code.code,
        `E${account.product_code.tariff_code}${account.area_code.group_id}`,
        period.dateFrom,
        period.dateTo,
    );

    const gasUnitRates = await getGasUnitRates(
        account.product_code.code,
        `G${account.product_code.tariff_code}${account.area_code.group_id}`,
        period.dateFrom,
        period.dateTo,
    );

    const gasStandingCharges = await getGasStandingCharges(
        account.product_code.code,
        `G${account.product_code.tariff_code}${account.area_code.group_id}`,
        period.dateFrom,
        period.dateTo,
    );

    const updatedAccount = {
        ...account,
        electricUnitRates,
        electricStandingCharges,
        gasUnitRates,
        gasStandingCharges,
        totals: {
            electric: 0,
            gas: 0
        }
    }

    for (const property of updatedAccount.properties) {
        if (property.mpan && property.electricSerialNumbers?.length) {
            property.usage = {
                electric: [],
                gas: [],
            }

            property.usage.electric = await getElectricUsage(
                updatedAccount.api_key,
                property.mpan,
                property.electricSerialNumbers,
                period.dateFrom,
                period.dateTo,
                period.group
            );
        }

        if (property.mprn && property.gasSerialNumbers?.length) {
            property.usage.gas = await getGasUsage(
                updatedAccount.api_key,
                property.mprn,
                property.gasSerialNumbers,
                period.dateFrom,
                period.dateTo,
                period.group
            );
        }

        property.usage.totals = {
            electric: calculateElectric(property.usage.electric, electricStandingCharges, electricUnitRates, period.group),
            gas: calculateGas(property.usage.gas, gasStandingCharges, gasUnitRates, period.group)
        }

        updatedAccount.totals.electric += parseFloat(property.usage.totals.electric);
        updatedAccount.totals.gas += parseFloat(property.usage.totals.gas);
    }

    console.log(updatedAccount);

    setLoading(false);

    return updatedAccount;
}