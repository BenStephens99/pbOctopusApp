import { isTokenExpired } from 'pocketbase';
import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export function middleware(request) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);

  const forbiddenUrls = ['/account', '/properties', '/dashboard'];

  const redirectToHome = (request) => {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  };

  if (forbiddenUrls.includes(request.nextUrl.pathname)) {
    const authCookie = request.cookies.get('pb_auth');

    if (!authCookie) {
      return redirectToHome(request);
    } else {
      pb.authStore.loadFromCookie(authCookie.value);
    }

    const token = pb.authStore.token;

    if (!token || isTokenExpired(token)) {
      return redirectToHome(request);
    }
  }
}
