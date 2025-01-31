'use client';

import { login } from '../../actions/auth/authActions';
import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Input } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login({ email, password });
    } catch (e) {
      setErrorMessage('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <h2>Login</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className=" text-red-500">{errorMessage}</p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button>
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button isLoading={loading} type="submit" color="primary" className="ml-auto">
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
