import { getPb } from './actions/auth/authActions';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import SignUp from './components/auth/SignUp';

export default async function Home() {
  let model = null;

  try {
    const pb = await getPb();
    model = pb.authStore.model;
  } catch (e) {}

  return (
    <>
      <div className="w-full max-w-96 mx-auto">{model ? <Logout /> : <Login />}</div>
    </>
  );
}
