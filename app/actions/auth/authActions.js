'use server';

import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const pb = new PocketBase('http://139.162.247.126:80');

export async function checkAuth() {
    const cookie = cookies().get('pb_auth');

    try {
      const { token, model } = JSON.parse(cookie.value);
      pb.authStore.loadFromCookie(cookie);
    
      return { token, model };
    } catch (e) {
      return null;
    }
}

export async function login(formData) {
  const email = formData.email
  const password = formData.password

  const { token, record: model } = await pb
    .collection('users')
    .authWithPassword(email, password);

  const cookie = JSON.stringify({ token, model });

  cookies().set('pb_auth', cookie, {
    secure: true,
    path: '/',
    sameSite: 'strict',
    httpOnly: true,
  });

  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('pb_auth');

  redirect('/');
}