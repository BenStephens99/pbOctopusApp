export const revalidate = 0

import AddHouse from "./components/AddHouse";
import { getHouses } from "@/app/actions/houses";
import { getOrganisations } from "../actions/organisations";
import House from "./components/House";
import Tariffs from "./components/Tariffs";
import { AddTariff } from "./components/AddTariff";
import { getElectricTariffs, getGasTariffs } from "@/app/actions/tariffs";


export default async function Houses() {

    const houses = await getHouses();
    const organisations = await getOrganisations();
    const electricTariffs = await getElectricTariffs();
    const gasTariffs = await getGasTariffs();

    return (
        <div className="flex flex-col gap-4">
            <Tariffs/>
            <div className="flex gap-4">
                <AddTariff organisations={organisations} type={'electric'}/>
                <AddTariff organisations={organisations} type={'gas'}/>
            </div>
            <h2>Houses</h2>
            <AddHouse organisations={organisations} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {houses.map((house) => (
                    <House 
                        key={house.id} 
                        house={house} 
                        electricTariffs={electricTariffs}
                        gasTariffs={gasTariffs}
                    />
                ))}
            </div>
        </div>
    );
}
