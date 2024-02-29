'use server';

import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

const pb = new PocketBase(process.env.POCKETBASE_URL);

export async function checkAuth() {
  try {
    const cookie = cookies().get('pb_auth');
    pb.authStore.loadFromCookie(cookie.value);
    return pb.authStore.model;
  } catch (e) {
    return null;
  }
}

export async function login(formData) {
  const email = formData.email
  const password = formData.password

  await pb.collection('users').authWithPassword(email, password);

  cookies().set("pb_auth", pb.authStore.exportToCookie());

  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('pb_auth');
  pb.authStore.clear();
  redirect('/');
}