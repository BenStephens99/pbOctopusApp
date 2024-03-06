'use server'

import { getPb } from "./auth/authActions";
import { addOrganisation } from "./organisations";

export async function addElectricTariff (formData) {
    const pb = await getPb();

    let organisation = formData.organisation;
    
    const data = {
        name: formData.name,
        product_code: formData.productCode,
        tariff_code: formData.tariffCode,
    }

    const newTariff = await pb.collection('electric_tariffs').create(data);

    if (!organisation) {
        const res =  await addOrganisation({
            name: `${pb.authStore.model.name}'s Organisation`
        });
        organisation = res.id;
    } 

    await addElectricToOrganisation(organisation, newTariff.id);

    return newTariff;
}

export async function addElectricTariffToHouse (houseId, electricTariffId) {
    const pb = await getPb();

    const house = await pb.collection('houses').getOne(houseId);

    house.electric_tariff = electricTariffId;

    const res = await pb.collection('houses').update(houseId, house);

    return res;
}

export async function addElectricToOrganisation(organisationId, electricId) {
    const pb = await getPb();
  
    const organisation = await pb.collection('organisations').getOne(organisationId);
  
    organisation.electric_tariffs.push(electricId);
  
    const res = await pb.collection('organisations').update(organisationId, organisation);
  
    return res;
  }

export async function getElectricTariffs () {
    const pb = await getPb();

    const res = await pb.collection('electric_tariffs').getFullList({ 
        sort: '-created'
    });

    return res;
}

export async function addGasTariff (formData) {
    const pb = await getPb();

    let organisation = formData.organisation;
    
    const data = {
        name: formData.name,
        product_code: formData.productCode,
        tariff_code: formData.tariffCode,
    }

    const newTariff = await pb.collection('gas_tariffs').create(data);

    if (!organisation) {
        const res =  await addOrganisation({
            name: `${pb.authStore.model.name}'s Organisation`
        });
        organisation = res.id;
    } 

    await addGasToOrganisation(organisation, newTariff.id);

    return newTariff;
}

export async function addGasTariffToHouse (houseId, gasTariffId) {
    const pb = await getPb();

    const house = await pb.collection('houses').getOne(houseId);

    house.gas_tariff = gasTariffId;

    const res = await pb.collection('houses').update(houseId, house);

    return res;
}

export async function addGasToOrganisation(organisationId, gasId) {
    const pb = await getPb();
  
    const organisation = await pb.collection('organisations').getOne(organisationId);

    console.log(organisation);
  
    organisation.gas_tariffs.push(gasId);
  
    const res = await pb.collection('organisations').update(organisationId, organisation);
  
    return res;
  }

export async function getGasTariffs () {
    const pb = await getPb();

    const res = await pb.collection('gas_tariffs').getFullList({ 
        sort: '-created'
    });

    return res;
}