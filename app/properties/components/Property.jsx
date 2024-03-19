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

    if (property.mpan && property.electricSerialNumber) {
        usage.electric = await getElectricUsage(
            account.api_key,
            property.mpan,
            property.electricSerialNumber,
            props.period.dateFrom,
            props.period.dateTo,
            'day'
        );
    }

    if (property.mprn && property.gasSerialNumber) {
        usage.gas = await getGasUsage(
            account.api_key,
            property.mprn,
            property.gasSerialNumber,
            props.period.dateFrom,
            props.period.dateTo,
            'day'
        );
    }

    return (
        <PropertyDisplay account={account} usage={usage} property={property} />
    );
}