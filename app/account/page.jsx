import AddAccountModal from "./components/AddAccoutModal";
import { getAccountsWithUsers } from "../actions/account";
import AccountDisplay from "./components/AccountDisplay";
import { checkAuth } from "../actions/auth/authActions";
import { getProducts } from "../actions/octopus";

export default async function Account() {

    const accounts = await getAccountsWithUsers();

    const auth = await checkAuth();
    const userId = auth.model.id;

    const productsRes = await getProducts()
    const products = productsRes.results;

    return (
        <div className="flex flex-col gap-2">
            <h2>Accounts</h2>
            <AddAccountModal />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {accounts.map(account => {
                    return (
                        <AccountDisplay userId={userId} products={products} key={account.id} account={account} />
                        )
                    })}
            </div>
        </div>
    );
}