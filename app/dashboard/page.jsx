'use server'
import { getHouses } from "../actions/houses";
import Test from "./components/test";
import { getElectricUsage } from "../actions/octopus";

export default async function Dashboard () {

    let usages = [];
    const houses = await getHouses();

    for (const house of houses) {
        const usage = await getElectricUsage(house.id);
        usages.push(usage);
    }

    return (
        <div>
            <h3>Dashboard</h3>
            <Test usages={usages} />
        </div>
    );
}