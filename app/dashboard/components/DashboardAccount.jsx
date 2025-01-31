'use client';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Tabs,
  Tab,
  Spinner,
  DatePicker,
} from '@nextui-org/react';
import { useState, useEffect, useRef } from 'react';
import {
  getElectricStandingCharges,
  getElectricUnitRates,
  getGasStandingCharges,
  getGasUnitRates,
  getGasUsage,
  getElectricUsage,
} from '@/app/actions/octopus';
import { calculateElectric, calculateGas, add } from '@/app/actions/calculations';
import Chart from 'chart.js/auto';

export default function DashboardAccount(props) {
  const [account, setAccount] = useState(props.account);
  const [period, setPeriod] = useState(periods.currentMonth);
  const [loading, setLoading] = useState(true);
  const [customFromDate, setCustomFromDate] = useState(null);
  const [customToDate, setCustomToDate] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getData(account, period, setLoading, customFromDate, customToDate).then((account) => {
      setAccount(account);
    });
  }, [period, customFromDate, customToDate]);

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
        datasets: [
          {
            label: 'Cost',
            data: [account.totals?.electric, account.totals?.gas],
            backgroundColor: ['rgba(71, 205, 120, 1)', 'rgba(92, 156, 234, 1)'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        color: 'white',
      },
    });
  }, [account]);

  return (
    <Card className="bg-default-100">
      <CardHeader className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 justify-between flex-wrap w-full">
          <h2>{account.name}</h2>
          <Tabs variant="bordered" selectedKey={period} onSelectionChange={setPeriod} isVertical={isMobile}>
            {Object.keys(periods).map((key) => (
              <Tab key={key} title={periods[key].name} />
            ))}
          </Tabs>
        </div>
        <div className="flex justify-end w-full">
          {period === 'custom' && (
            <div className="flex gap-2">
              <DatePicker
                value={customFromDate}
                onChange={(date) => setCustomFromDate(date)}
                label="From"
              />
              <DatePicker
                value={customToDate}
                onChange={(date) => setCustomToDate(date)}
                label="To"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex justify-between gap-6">
          <div>Electric:</div>
          <div className="text-green-400 flex items-center">
            {period === 'custom' && (!customFromDate || !customToDate) ?
              ''
              :
              loading ? <Spinner size="sm" /> : '£' + account.totals?.electric.toFixed(2)
            }
          </div>
        </div>
        <div className="flex justify-between gap-6">
          <div>Gas:</div>
          <div className="text-blue-400 flex items-center">
            {period === 'custom' && (!customFromDate || !customToDate) ?
              ''
              :
              loading ? <Spinner size="sm" /> : '£' + account.totals?.gas.toFixed(2)
            }
          </div>
        </div>
        <div className="flex justify-between gap-6 mt-2">
          <div>Total:</div>
          <div className="flex items-center">
            {period === 'custom' && (!customFromDate || !customToDate) ?
              ''
              :
              loading ? <Spinner size="sm" /> : '£' + add(account.totals?.electric, account.totals?.gas)
            }
          </div>
        </div>
        <Divider className="mt-3" />

        <div className="h-64 w-64 mx-auto flex justify-center items-center">
          {period === 'custom' && (!customFromDate || !customToDate) ?
            'Select a from and to date'
            :
            loading ? <Spinner /> : <canvas ref={chartRef} width="400" height="400"></canvas>
          }
        </div>
        <Divider className="my-3" />
        <div className="flex flex-col gap-2">
          <h3>Properties</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {account.properties.map((property) => (
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
      <CardFooter></CardFooter>
    </Card>
  );
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
  },
  custom: {
    dateFrom: null,
    dateTo: null,
    group: 'month',
    name: 'Custom',
  },
};

async function getData(account, p, setLoading, customFromDate, customToDate) {
  const period = periods[p];

  if (p === 'custom') {
    if (!customFromDate || !customToDate) {
      return account;
    }
    period.dateFrom = new Date(customFromDate).toISOString();
    period.dateTo = new Date(customToDate).toISOString();
  }

  if (!period?.dateFrom || !period?.dateTo) {
    return account;
  }

  const electricUnitRates = await getElectricUnitRates(
    account.product_code.code,
    `E${account.product_code.tariff_code}${account.area_code.group_id}`,
    period.dateFrom,
    period.dateTo
  );

  const electricStandingCharges = await getElectricStandingCharges(
    account.product_code.code,
    `E${account.product_code.tariff_code}${account.area_code.group_id}`,
    period.dateFrom,
    period.dateTo
  );

  const gasUnitRates = await getGasUnitRates(
    account.product_code.code,
    `G${account.product_code.tariff_code}${account.area_code.group_id}`,
    period.dateFrom,
    period.dateTo
  );

  const gasStandingCharges = await getGasStandingCharges(
    account.product_code.code,
    `G${account.product_code.tariff_code}${account.area_code.group_id}`,
    period.dateFrom,
    period.dateTo
  );

  const updatedAccount = {
    ...account,
    electricUnitRates,
    electricStandingCharges,
    gasUnitRates,
    gasStandingCharges,
    totals: {
      electric: 0,
      gas: 0,
    },
  };

  for (const property of updatedAccount.properties) {
    const usagePromises = [];
    property.usage = {
      electric: [],
      gas: [],
    };

    if (property.mpan && property.electricSerialNumbers?.length) {
      usagePromises.push(
        getElectricUsage(
          updatedAccount.api_key,
          property.mpan,
          property.electricSerialNumbers,
          period.dateFrom,
          period.dateTo,
          period.group
        ).then(result => property.usage.electric = result)
      );
    }

    if (property.mprn && property.gasSerialNumbers?.length) {
      usagePromises.push(
        getGasUsage(
          updatedAccount.api_key,
          property.mprn,
          property.gasSerialNumbers,
          period.dateFrom,
          period.dateTo,
          period.group
        ).then(result => property.usage.gas = result)
      );
    }

    // Wait for both requests to complete
    await Promise.all(usagePromises);

    property.usage.totals = {
      electric: calculateElectric(
        property.usage.electric,
        electricStandingCharges,
        electricUnitRates,
        period.group
      ),
      gas: calculateGas(property.usage.gas, gasStandingCharges, gasUnitRates, period.group),
    };

    updatedAccount.totals.electric += parseFloat(property.usage.totals.electric);
    updatedAccount.totals.gas += parseFloat(property.usage.totals.gas);
  }
  setLoading(false);

  return updatedAccount;
}
