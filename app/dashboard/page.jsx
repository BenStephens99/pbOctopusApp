'use server'
import DashboardAccount from "./components/DashboardAccount"
import { getAccountsWithData } from "../actions/account";
import { getProperties } from "../actions/properties";

export default async function Page () {
    const accounts = await getAccountsWithData();
    
    for (const account of accounts) {
        account.properties = await getProperties(account);
    }

    return (
        <div>
            <h1 className="mb-4">Dashboard</h1>
            <div className="grid lg:grid-cols-2 gap-4">
                {accounts.map(account => (
                    <DashboardAccount account={account} key={account.id}/>
                ))}
            </div>
        </div>
    )
}