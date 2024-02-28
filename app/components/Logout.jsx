'use client'
import { logout } from "../actions/auth/authActions"

export default function Logout() {
    
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}