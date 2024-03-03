'use client';

import { login } from "../../actions/auth/authActions";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await login({ email, password });
        } catch (e) {
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <main>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
                <p>{errorMessage}</p>
            </form>
        </main>
    );
}