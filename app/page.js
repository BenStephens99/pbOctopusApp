import { checkAuth } from "./actions/auth/authActions";
import Login from "./components/Login";
import Logout from "./components/Logout";

export default async function Home() {

  let token = null;
  let model = null;

  try {
    const res = await checkAuth();
    token = res.token;
    model = res.model;
  } catch (e) {}

  return (
    <main>
      <h1>Home</h1>
      {token ?
      <div>
        <div>{`Logged in as ${model.email}`}</div>
        <Logout />
      </div>
        :
        <Login />
      }
    </main>
  );
}
