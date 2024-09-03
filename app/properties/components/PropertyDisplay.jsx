'use client'

import { Card, CardHeader, CardBody, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider } from "@nextui-org/react";
import { calculateElectric, calculateGas, add } from "@/app/actions/calculations";


export default function PropertyDisplay(props) {
    let property = props.property;
    
    property = {
        ...property,
        usage: {
            electric: props.usage.electric,
            gas: props.usage.gas,
        },
        electric: {
            unitRates: props.account.electricUnitRates,
            standingCharges: props.account.electricStandingCharges,
        },
        gas: {
            unitRates: props.account.gasUnitRates,
            standingCharges: props.account.gasStandingCharges,
        },
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
        <a href={`/properties/${account.id}?postcode=${property.postcode.replace(/\s/g, '')}`} className="w-full duration-25 hover:brightness-90">
            <Card className="bg-default-100 h-full w-full">
                <CardHeader>
                    <div className="capitalize flex flex-col gap-2">
                        <span className="text-xs">{property.accountNumber}</span>
                        <span>{property.addressLine1.toLowerCase()}</span>
                        <span className="text-xs">{property.postcode}</span>
                    </div>
                </CardHeader>
                <CardBody className="justify-end pt-0">
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
                <CardFooter className="flex-col justify-end pt-0">
                    <Divider className="mb-4" />
                    <div className="flex justify-between w-full">
                        <span>Total:</span>
                        <span>&pound;{add(electricCost, gasCost)}</span>
                    </div>
                </CardFooter>
            </Card>
        </a>
    );
}

function randAddress () {
    const roadNames = ['Demonstration Lane', 'Test Street', 'Example Road', 'Sample Street', 'Fake Road', 'Mock Lane', 'Trial Street', 'Dummy Road'];

    const roadName = roadNames[Math.floor(Math.random() * roadNames.length)];

    const number = Math.floor(Math.random() * 200);

    return `${number} ${roadName}`;
}

function randAccountNumber () {
    const prefix = 'A-';

    const number = Math.floor(Math.random() * 1000000);

    return `${prefix}${number}`;
}

function randPostcode () {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let postcode = '';

    for (let i = 0; i < 2; i++) {
        postcode += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 2; i++) {
        postcode += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    postcode += ' ';

    for (let i = 0; i < 3; i++) {
        postcode += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return postcode;
}