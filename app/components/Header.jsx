import { checkAuth } from "../actions/auth/authActions";
import Logout from "./auth/Logout";

export default async function Header() {
    let currentPath = null;

    if (typeof window !== "undefined") {
        currentPath = window.location.pathname;
    }

    let authValid = null;
    let model = null;
    try {
        const res = await checkAuth();
        authValid = res.isValid;
        model = res.model;
    } catch (e) {}

  return (
    <header className="w-full mb-4">
        {authValid ? 
          <div className="flex gap-4 items-center flex-wrap justify-between">
            <div className="flex gap-2">
              <a href="/account">
                <button>Account</button>
              </a>
              <a href="/properties">
                <button>Properties</button>
              </a>
            </div>
            <div className="flex gap-2 items-center">
              <p className="hidden sm:block">{model.email}</p>
              <Logout /> 
            </div>
          </div> 
          : 
          <a href="/">
            <button>Login</button>
          </a>
        }
    </header>
  );
}