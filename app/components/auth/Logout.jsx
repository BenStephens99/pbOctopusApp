'use client';
import { logout } from '../../actions/auth/authActions';
import { Button } from '@nextui-org/button';
import { useEffect, useState } from 'react';

export default function Logout() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (confirm('logout?')) {
      await logout();
    }
    setLoading(false);
  };

  return (
    <Button isLoading={loading} color="primary" variant="flat" onClick={handleLogout}>
      Logout
    </Button>
  );
}
