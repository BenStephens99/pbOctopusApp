'use client'

import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@nextui-org/react";
import { calculateElectric, calculateGas } from "@/app/actions/calculations";

export default function PropertyDisplay(props) {
    const property = props.property;
    const account = props.account; 

    const electricCost = calculateElectric(
        props.usage.electric,
        account.electricStandingCharges,
        account.electricUnitRates
    );

    const gasCost = calculateGas(
        props.usage.gas,
        account.gasStandingCharges,
        account.gasUnitRates
    );


    return (
        <Card className="bg-default-100 w-full max-w-full sm:w-60">
            <CardHeader>
                <div className="capitalize flex flex-col gap-2">
                    <span className="text-xs">{property.accountNumber}</span>
                    <span>{toLowerCase(property.addressLine1)}</span>
                    <span className="text-xs">{property.postcode}</span>
                </div>
            </CardHeader>
            <CardBody className="justify-end">
                <Divider className="mb-4" />
                <span className="flex justify-between">
                    <span>Electric:</span>
                    <span className="text-green-400">&pound;{electricCost}</span>
                </span>
                <span className="flex justify-between">
                    <span>Gas:</span>
                    <span className="text-blue-400">&pound;{gasCost}</span>
                </span>
            </CardBody>
        </Card>
    );
}

function toLowerCase(str) {
    return str.toLowerCase();
}   
