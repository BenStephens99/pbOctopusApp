export const revalidate = 0

import AddHouse from "./components/AddHouse";
import { getHouses } from "@/app/actions/houses";
import { getOrganisations } from "../actions/organisations";
import House from "./components/House";
import Tariffs from "./components/Tariffs";
import { AddTariff } from "./components/AddTariff";


export default async function Houses() {

    const houses = await getHouses();
    const organisations = await getOrganisations();

    return (
        <div className="flex flex-col gap-4">
            <h2>Houses</h2>
            <AddTariff organisations={organisations} type={'electric'}/>
            <AddTariff organisations={organisations} type={'gas'}/>
            <Tariffs/>
            <AddHouse organisations={organisations} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {houses.map((house) => (
                    <House key={house.id} house={house} />
                ))}
            </div>
        </div>
    );
}
