import { checkAuth } from "../actions/auth/authActions";
import Logout from "./auth/Logout";

export default async function Header() {
    let authValid = null;
    let model = null;
    try {
        const res = await checkAuth();
        authValid = res.isValid;
        model = res.model;
    } catch (e) {}

  return (
    <header className="flex justify-between flex-wrap">
        <a href="/dashboard">
          <h1>Home</h1>
        </a>
        {authValid ? 
          <div className="flex gap-4 items-center flex-wrap justify-end text-right">
            <p className="text-right">{`${model.email}`}</p>
            <a href="/organisations">
              <button>Organisations</button>
            </a>
            <a href="/houses">
              <button>Houses</button>
            </a>
            <Logout />
          </div> 
          : 
          <a href="/">
            <button>Login</button>
          </a>
        }
    </header>
  );
}