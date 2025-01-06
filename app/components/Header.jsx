'use client';

import Logout from './auth/Logout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserInvites from '../account/components/UserInvites';

import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';

export default function Header(props) {
  let model = props.model;

  const pathname = usePathname();

  return (
    <Navbar
      maxWidth="full"
      isBlurred
      isBordered
      classNames={{
        wrapper: ['px-0'],
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      {model ? (
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
            <NavbarItem isActive={pathname === '/dashboard'}>
              <Link color="foreground" href="/dashboard">
                Dashboard
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <p className="hidden sm:block">{model.email}</p>
            </NavbarItem>
            <NavbarItem>
              <UserInvites invitations={props.invitations} />
            </NavbarItem>
            <NavbarItem>
              <div className="hidden sm:block">
                <Logout />
              </div>
            </NavbarItem>
          </NavbarContent>
        </>
      ) : (
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
      )}
    </Navbar>
  );
}
