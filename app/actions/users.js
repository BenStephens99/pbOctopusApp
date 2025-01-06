'use server';

import { getPb } from './auth/authActions';

export async function getUser(id) {
  const pb = await getPb();

  const res = await pb.collection('users').getOne(id);

  return res;
}

export async function getUsers(ids) {
  const pb = await getPb();

  let q = ids.map((id) => {
    return `id = "${id}"`;
  });

  q = q.join(' || ');

  const res = await pb.collection('users').getList(1, 50, {
    filter: `id = "" ${q.length ? `|| ${q}` : ''}`,
  });

  return res.items || [];
}
