export const revalidate = 0;

import AddAccountModal from './components/AddAccoutModal';
import { getAccountsWithData } from '../actions/account';
import AccountDisplay from './components/AccountDisplay';
import { getPb } from '../actions/auth/authActions';
import { getProducts } from '../actions/products';
import { getAreaCodes } from '../actions/areaCodes';

export default async function Account() {
  let pb = null;
  let userId = null;

  const accounts = await getAccountsWithData();

  try {
    pb = await getPb();
    userId = pb.authStore.model.id;
  } catch (e) {}

  const products = await getProducts();
  const areaCodes = await getAreaCodes();

  return (
    <div className="flex flex-col gap-2">
      <AddAccountModal products={products} areaCodes={areaCodes} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((account) => {
          return (
            <AccountDisplay
              products={products}
              areaCodes={areaCodes}
              userId={userId}
              key={account.id}
              account={account}
            />
          );
        })}
      </div>
    </div>
  );
}
