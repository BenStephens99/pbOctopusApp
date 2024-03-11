export const revalidate = 0;

import { getPropertiesPage } from "../actions/properties";
import Test from "./Test";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import PropertyDisplay from "./components/PropertyDisplay";

export default async function Properties() {

    const pageData = await getPropertiesPage();

    return (
        <div>
            <h1>Properties</h1>
            <Test pageData={pageData}/>
            <div className="flex flex-wrap gap-2">
                {pageData.map((account, index) => {
                    return (
                        <Card key={index}>
                            <CardHeader>
                                <h2>{account.name}</h2>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex flex-wrap gap-2">
                                    {account.properties.map((property, index) => {
                                        return (
                                            <PropertyDisplay key={index} property={property} />
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