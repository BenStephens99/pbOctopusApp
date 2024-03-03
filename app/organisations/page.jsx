export const revalidate = 0

import { getOrganisations } from "../actions/organisations";
import Organisation from "./components/organisation"
import AddOrganisation from "./components/AddOrganisation";

export default async function Dashboard() {

    const organisations = await getOrganisations();

    return (
        <div className="flex flex-col gap-4">
            <h2>Dashboard</h2>
            <AddOrganisation organisations={organisations} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {organisations.length
                    ?
                    organisations.map((organisation) => (
                        <Organisation key={organisation.id} name={organisation.name} organisation={organisation} />
                    ))
                    :
                    <div>
                        <h4>No organisations found</h4>
                        <p>Add one to get started</p>
                    </div>
                }
            </div>

        </div>
    );
}