import { getPb } from "./actions/auth/authActions";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import SignUp from "./components/auth/SignUp";

export default async function Home() {
  let model = null;

  try {
    const pb = await getPb();
    model = pb.authStore.model
  } catch (e) { }

  return (
    <>
      <main>
        <div className="flex justify-center">
          {model ?
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
