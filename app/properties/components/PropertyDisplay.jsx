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
        <Card className="bg-default-100">
            <CardHeader>
                <div className="capitalize flex flex-col gap-2">
                    <span>{toLowerCase(property.addressLine1)}</span>
                    <span className="text-xs">{property.postcode}</span>
                </div>
            </CardHeader>
            <CardBody>
                <Divider className="mb-4" />
                <span className="flex justify-between">
                    <span>Electric:</span>
                    <span>&pound;{electricCost}</span>
                </span>
                <span className="flex justify-between">
                    <span>Gas:</span>
                    <span>&pound;{gasCost}</span>
                </span>
            </CardBody>
        </Card>
    );
}

function toLowerCase(str) {
    return str.toLowerCase();
}   
