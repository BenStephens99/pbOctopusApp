'use client'

import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function PropertyDisplay(props) {
    const property = props.property

    console.log(property)

    return (
        <div>
            <Table
                className="text-right"
                classNames={{
                    wrapper: 'bg-default-100',
                }}
            >
                <TableHeader>
                    <TableColumn colSpan={2} className="bg-default">
                        <h4 className="capitalize">{toLowerCase(property.name)}</h4>
                    </TableColumn >
                    <TableColumn className="bg-default"></TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Gas: </TableCell>
                        <TableCell>&pound;{property.gas.cost}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Electric</TableCell>
                        <TableCell>&pound;{property.electric.cost}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

function toLowerCase(str) {
    return str.toLowerCase();
}   
