import { checkAuth } from "../actions/auth/authActions";

export default async function Header() {
    let model = null;
    try {
        const res = await checkAuth();
        model = res.model;
    } catch (e) {
        console.log(e);
    }

  return (
    <header className="flex justify-between">
        <h1>App</h1>
        {model ? <div>{`Logged in as ${model.email}`}</div> : 'Not logged in'}
    </header>
  );
}