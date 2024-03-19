'use client'

import Logout from "./auth/Logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/react";

export default function Header(props) {
  let model = props.model;

  const pathname = usePathname();

  console.log(pathname);

  return (
    <Navbar maxWidth="full" isBlurred isBordered
      classNames={{
        wrapper: [
          "px-0"
        ],
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      {model ?
        <>
          <NavbarContent className="flex gap-4">
            <NavbarItem isActive={pathname === '/account'}>
              <Link color="foreground" href="/account">
                Account
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname === '/properties'}>
              <Link color="foreground" href="/properties">
                Properties
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <p className="hidden sm:block">{model.email}</p>
            </NavbarItem>
            <NavbarItem>
              <Logout />
            </NavbarItem>
          </NavbarContent>
        </>
        :
        <NavbarContent>
          <NavbarItem isActive={pathname === '/'}>
            <Link color="foreground" href="/">
              Login
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === '/register'}>
            <Link color="foreground" href="/register">
              Register
            </Link>
          </NavbarItem>
        </NavbarContent>
      }
    </Navbar>
  );
}




{/* <header className="w-full mb-4">
{authValid ? 
  <div className="flex gap-4 items-center flex-wrap justify-between">
    <div className="flex gap-2">
      <a href="/account">
        <button>Account</button>
      </a>
      <a href="/properties">
        <button>Properties</button>
      </a>
    </div>
    <div className="flex gap-2 items-center">
      <p className="hidden sm:block">{model.email}</p>
      <Logout /> 
    </div>
  </div> 
  : 
  <a href="/">
    <button>Login</button>
  </a>
}
</header> */}