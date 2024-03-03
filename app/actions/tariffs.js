'use server'

import { getPb } from "./auth/authActions";

export async function addElectricTariff (formData) {
    const pb = await getPb();
    

    const data = {}


    const newTariff = await pb.collection('electric_tariff').create(data);

    return newTariff;
}