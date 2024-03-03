'use server'

export async function test () {
    const res = await fetch('https://api.octopus.energy/v1/products/VAR-22-11-01/')
    const data = await res.json()

    return data
}

export async function getProducts () {
    const res = await fetch('https://api.octopus.energy/v1/products/')
    const data = await res.json()


    return data.results
}

export async function getSingleRegisterElectricityTariffs (productCode) {
    const res = await fetch(`https://api.octopus.energy/v1/products/${productCode}/`)
    const data = await res.json()

    return data.single_register_electricity_tariffs
} 

export async function getSingleRegisterGasTariffs (productCode) {
    const res = await fetch(`https://api.octopus.energy/v1/products/${productCode}/`)
    const data = await res.json()

    return data.single_register_gas_tariffs
}