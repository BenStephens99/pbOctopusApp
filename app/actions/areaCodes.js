'use server';

import { getPb } from './auth/authActions';

export async function getAreaCodes() {
  const pb = await getPb();

  const records = await pb.collection('area_codes').getFullList({
    sort: 'name',
  });

  return records;
}

export async function getAreaCode(areaCodeId) {
  const pb = await getPb();

  const record = await pb.collection('area_codes').getOne(areaCodeId);

  return record;
}
