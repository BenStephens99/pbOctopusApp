'use client'

import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@nextui-org/react";
import { calculateElectric, calculateGas } from "@/app/actions/calculations";

export default function PropertyDisplay(props) {
    let property = props.property;
    
    property = {
        ...property,
        usage: {
            electric: props.usage.electric,
            gas: props.usage.gas,
        }
    }

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

    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(`${account.id}-${property.postcode.replace(/\s/g, '')}`, JSON.stringify(property));
    }

    return (
        <a href={`/properties/${account.id}?postcode=${property.postcode.replace(/\s/g, '')}`} className="w-full max-w-full duration-250 sm:w-72 hover:brightness-90">
            <Card className="bg-default-100">
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
        </a>
    );
}

function toLowerCase(str) {
    return str.toLowerCase();
}   
