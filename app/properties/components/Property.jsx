export const revalidate = 3600;

import PropertyDisplay from "./PropertyDisplay"
import { getElectricUsage, getGasUsage } from "@/app/actions/octopus";

export default async function Property(props) {
    const property = props.property;
    const account = props.account;

    const usage = {
        electric: [],
        gas: [],
    }

    if (property.mpan && property.electricSerialNumbers?.length) {
        usage.electric = await getElectricUsage(
            account.api_key,
            property.mpan,
            property.electricSerialNumbers,
            props.period.dateFrom,
            props.period.dateTo,
            'day'
        );
    }

    if (property.mprn && property.gasSerialNumbers?.length) {
        usage.gas = await getGasUsage(
            account.api_key,
            property.mprn,
            property.gasSerialNumbers,
            props.period.dateFrom,
            props.period.dateTo,
            'day'
        );
    }

    return (
        <PropertyDisplay account={account} usage={usage} property={property} />
    );
}