'use server';

import { redirect } from 'next/navigation';
import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';

export async function getPb() {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  try {
    const cookie = cookies().get('pb_auth');
    pb.authStore.loadFromCookie(cookie.value);
  } catch (e) {}
  return pb;
}

export async function signUp(formData) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  
  const data = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    passwordConfirm: formData.passwordConfirm,
  }

  try {
    await pb.collection('users').create(data);
  } catch (e) {
    console.error(e);
    return e.data.message;
  }

  await login({ email: data.email, password: data.password });
}

export async function login(formData) {
  const pb = new PocketBase(process.env.POCKETBASE_URL);

  const email = formData.email
  const password = formData.password
  
    await pb.collection('users').authWithPassword(email, password);

    cookies().set("pb_auth", pb.authStore.exportToCookie());

    redirect('/properties');
  }

export async function logout() {
  const pb = await getPb();

  cookies().delete('pb_auth');
  pb.authStore.clear();
  redirect('/');
}