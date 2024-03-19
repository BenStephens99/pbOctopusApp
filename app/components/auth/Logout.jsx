'use client'
import { logout } from "../../actions/auth/authActions"
import { Button } from "@nextui-org/button"

export default function Logout() {
    
    const handleLogout = (e) => {
        e.preventDefault();
        if (confirm('logout?')) {
            logout();
        }
    }

  return (
    <Button color="primary" variant="flat" onClick={handleLogout}>
        Logout
    </Button>
  )
}