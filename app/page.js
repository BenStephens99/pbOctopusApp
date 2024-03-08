import { checkAuth } from "./actions/auth/authActions";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import SignUp from "./components/auth/SignUp";

export default async function Home() {
  let authValid = false;

  try {
    const res = await checkAuth();
    authValid = res.isValid;
  } catch (e) { }

  return (
    <>
      <main>
        <div className="flex justify-center">
          {authValid ?
            <Logout />
            :
            <div className="">
              <Login />
              <SignUp />
            </div>
          }
        </div>
      </main>
    </>
  );
}
