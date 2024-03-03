'use client';

import { signUp } from "@/app/actions/auth/authActions";
import { useState } from "react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        await signUp({ email, password });
    }

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}