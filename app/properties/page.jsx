export const revalidate = 0;
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { getAccountsWithData } from "../actions/account";
import { getProperties } from "../actions/properties";
import Property from "./components/Property";

import { getElectricUnitRates, getElectricStandingCharges, getGasStandingCharges, getGasUnitRates } from "../actions/octopus";

export default async function Properties() {

    const accounts = await getAccountsWithData();

    const dateFrom = new Date();
    dateFrom.setHours(0, 0, 0, 0);
    dateFrom.setDate(28);
    dateFrom.setMonth(dateFrom.getMonth() - 1);
    const dateFromToISOString = dateFrom.toISOString();

    const dateTo = new Date();
    const dateToToISOString = dateTo.toISOString();

    const period = {
        dateFrom: dateFromToISOString,
        dateTo: dateToToISOString,
    }

    for (const account of accounts) {
        account.properties = await getProperties(account);
        
        account.electricUnitRates = await getElectricUnitRates(
            account.product_code.code,
            `E${account.product_code.tariff_code}${account.area_code.group_id}`,
            period.dateFrom,
            period.dateTo,
        );

        account.electricStandingCharges = await getElectricStandingCharges(
            account.product_code.code,
            `E${account.product_code.tariff_code}${account.area_code.group_id}`,
            period.dateFrom,
            period.dateTo,
        );

        account.gasUnitRates = await getGasUnitRates(
            account.product_code.code,
            `G${account.product_code.tariff_code}${account.area_code.group_id}`,
            period.dateFrom,
            period.dateTo,
        );

        account.gasStandingCharges = await getGasStandingCharges(
            account.product_code.code,
            `G${account.product_code.tariff_code}${account.area_code.group_id}`,
            period.dateFrom,
            period.dateTo,
        );
    }

    return (
        <div>
            <div className="sm:flex flex-wrap gap-4">
                {accounts.map((account, index) => {
                    return (
                        <Card key={index} className="p-0 mt-4 sm:mt-0 w-full">
                            <CardHeader>
                                <div className="flex flex-col gap-2">
                                    <h1>{account.name}</h1>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                    {account.properties.map((property, index) => {
                                        return (
                                            <Property key={index} period={period} account={account} property={property} />
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}