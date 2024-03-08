export const revalidate = 0;

import { getPropertiesPage } from "../actions/properties";
import Test from "./Test";

export default async function Properties() {

    const pageData = await getPropertiesPage();

    return (
        <div>
            <h1>Properties</h1>
            <Test pageData={pageData}/>
            <div className="flex flex-wrap gap-2">
                {pageData.map((account, index) => {
                    return (
                        <div key={index} className="bg-white p-4 shadow-md rounded-sm">
                            <h2>{account.name}</h2>
                            <div className="flex flex-wrap">
                                {account.properties.map((property, index) => {
                                    return (
                                        <div key={index} className="p-4 rounded-sm bg-gray-100 max-w-96">
                                            <h3 className="capitalize mb-4">{toLowerCase(property.name)}</h3>
                                            <table className="ml-auto">
                                                <tbody className="text-right">
                                                    <tr>
                                                        <th className="pr-4">Electric:</th>
                                                        <td>&pound;{property.electric.cost}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className="pr-4">Gas:</th>
                                                        <td>&pound;{property.gas.cost}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function toLowerCase(str) {
    return str.toLowerCase();
}   