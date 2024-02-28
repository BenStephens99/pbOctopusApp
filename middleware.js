import { isTokenExpired } from "pocketbase";
import { NextResponse } from "next/server";

export function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      const authCookie = request.cookies.get('pb_auth');
      const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;
  
      if (!token || isTokenExpired(token)) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  }