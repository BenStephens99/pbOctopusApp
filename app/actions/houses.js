'use server'

import { getPb } from "./auth/authActions";
import { getOrganisations, addOrganisation, addHouseToOrganisation } from "./organisations";

export async function getHouses() {
    const pb = await getPb();

    const records = await pb.collection('houses').getFullList({
        sort: '-created',
      });

    return records;
}

export async function deleteHouse(id) {
    const pb = await getPb();
    const res = await pb.collection('houses').delete(id);
    return res;
}

export async function getHouseNames (ids) {
    const pb = await getPb();

    ids = ids || [];
    ids = ids.map((id) => `id = "${id}"`);

    let filter = ids.join(' || ');

    if (!filter) {
        filter = 'id = ""';
    }
    
    const records = await pb.collection('houses').getList(1, 50, {
        sort: '-created',
        filter
    });

    return records.items.map((record) => record.name);
}

export async function getHouse(id) {
    const pb = await getPb();

    const record = await pb.collection('houses').getOne(id);

    return record;
}

export async function addHouse (formData) {
    const pb = await getPb();

    let organisation = formData.organisation;

    const data = {
        name: formData.name,
        elec_mpan: formData.electricMpan,
        elec_serial_num: formData.electricSerial,
        gas_mprn: formData.gasMprn,
        gas_serial_num: formData.gasSerial,
        
    }

    if (!organisation) {
        const res =  await addOrganisation({
            name: `${pb.authStore.model.name}'s Organisation`
        });
        organisation = res.id;
    } 

    const res = await pb.collection('houses').create(data)

    await addHouseToOrganisation(organisation, res.id);

    return res.id
}

export async function updateHouse (formData) {
    const pb = await getPb();

    console.log(formData);

    const data = {
        name: formData.name,
        elec_mpan: formData.elecMpan,
        elec_serial_num: formData.elecSerial,
        electric_tariff: formData.elecTariff,
        gas_mprn: formData.gasMprn,
        gas_serial_num: formData.gasSerial,
        gas_tariff: formData.gasTariff
    }

    const res = await pb.collection('houses').update(formData.id, data);

    return res;
}