import { getAccount } from "../actions/account";
import Test from "./components/test";
import AddAccount from "./components/AddAccout";

export default async function Account () {

    const account = await getAccount();
    
    return (
        <div>
            <h3>Account</h3>
            <AddAccount />
        </div>
    );
}