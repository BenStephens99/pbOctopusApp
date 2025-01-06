'use server';

import { getPb } from './auth/authActions';

export async function getAccountNumbers([ids]) {
  if (!ids.length) return [];

  const pb = await getPb();

  let filter = ids.map((id) => {
    return `id = "${id}"`;
  });

  filter = filter.join(' || ');

  const records = await pb.collection('account_numbers').getList(1, 50, {
    filter: `${filter}`,
  });

  return records.items || [];
}

export async function updateAccountNumber(id, account_number) {
  const pb = await getPb();

  const res = await pb.collection('account_numbers').update(id, {
    number: account_number,
  });

  return res;
}

export async function getAccountNumber(id) {
  const pb = await getPb();

  const record = await pb.collection('account_numbers').getOne(id);

  return record;
}

export async function addAccountNumber(account_number) {
  const pb = await getPb();

  const res = await pb.collection('account_numbers').create({
    number: account_number,
  });

  return res;
}
