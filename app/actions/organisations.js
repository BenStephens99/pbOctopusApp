'use server'

import { getPb } from "./auth/authActions";
import { getUsersNames } from "./users";
import { getHouseNames } from "./houses";

export async function getOrganisations() {
  const pb = await getPb();

  const records = await pb.collection('organisations').getFullList({
    sort: '-created',
  });

  for (const record of records) {
    record.users = await getUsersNames(record.users);
    record.houses = await getHouseNames(record.houses);
  }

  return records;
}

export async function addOrganisation(formData) {
  const pb = await getPb();

  const data = {
    name: formData.name,
    users: [pb.authStore.model.id],
  }

  const res = await pb.collection('organisations').create(data);
  return res;
}

export async function addHouseToOrganisation(organisationId, houseId) {
  const pb = await getPb();

  const organisation = await pb.collection('organisations').getOne(organisationId);

  organisation.houses.push(houseId);

  const res = await pb.collection('organisations').update(organisationId, organisation);

  return res;
}

export async function getOrganisation (organisationId) {
  const pb = await getPb();
  const res = await pb.collection('organisations').getOne(organisationId);
  return res;
}

export async function deleteOrganisation(id) {
  const pb = await getPb();
  const res = await pb.collection('organisations').delete(id);
  return res;
}