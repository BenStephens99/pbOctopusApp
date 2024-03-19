'use client';

import { signUp } from "@/app/actions/auth/authActions";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button"

export default function SignUp() {
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (password === passwordConfirm) {
            setPasswordsMatch(true);
        }
    }, [password, passwordConfirm]);
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !password || !passwordConfirm) {
            return;
        }
        
        if (password !== passwordConfirm) {
            setPasswordsMatch(false);
            return;
        }
        
        setLoading(true);

        await signUp({ name, email, password, passwordConfirm });
        setLoading(false);
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <h2>Sign Up</h2>
            </CardHeader>
            <Divider />
            <CardBody>
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <Input 
                        label="Name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        required
                        isInvalid={!passwordsMatch}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <Button isLoading={loading} type="submit" color="primary" className="ml-auto">Sign Up</Button>
                </form>
            </CardBody>
        </Card>
    );
}