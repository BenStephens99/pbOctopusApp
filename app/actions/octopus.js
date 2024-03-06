'use server'
import { getHouse } from "./houses"
import { getOrganisations, getOrganisation } from "./organisations"
import { getKey } from "./keys"

export async function test() {
    const res = await fetch('https://api.octopus.energy/v1/products/VAR-22-11-01/')
    const data = await res.json()

    return data
}

export async function getProducts() {
    const res = await fetch('https://api.octopus.energy/v1/products/')
    const data = await res.json()


    return data.results
}

export async function getSingleRegisterElectricityTariffs(productCode) {
    const res = await fetch(`https://api.octopus.energy/v1/products/${productCode}/`)
    const data = await res.json()

    return data.single_register_electricity_tariffs
}

export async function getSingleRegisterGasTariffs(productCode) {
    const res = await fetch(`https://api.octopus.energy/v1/products/${productCode}/`)
    const data = await res.json()

    return data.single_register_gas_tariffs
}

export async function getElectricUsage() {
    const organisations = await getOrganisations()

    for (const o of organisations) {
        const organisation = await getOrganisation(o.id)
        const key = await getKey(organisation.api_key)
        for (const h of organisation.houses) {
            const house = await getHouse(h)

            const url = `https://api.octopus.energy/v1/electricity-meter-points/${house.mpan}/meters/${house.mprn}/consumption/`
            
            console.log(key)

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${btoa(key + ':')}` // Use btoa to encode the apiKey and ':' in base64
                    },
                });

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
}

