'use server'

export async function getOctopusAccount(accountNumber, apiKey) {
    const url = `https://api.octopus.energy/v1/accounts/${accountNumber}/`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(apiKey + ':')}` 
        },
    });

    const data = await response.json();
    return data;
} 

export async function getOctopusAccounts (account) {

    let octopusAccounts = []

    for (let a of account.account_numbers) {
        const octopusAccount = await getOctopusAccount(a.number, account.api_key)
        octopusAccounts.push(octopusAccount)
    }

    return octopusAccounts
}

// export async function getProducts () {
//     const url = `https://api.octopus.energy/v1/products/`

//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     const data = await response.json();
//     return data;
// }

export async function getElectricUsage(apiKey, mpan, serialNumber, from, to, group_by = 'day') {
    const url = `https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serialNumber}/consumption/?period_from=${from}&period_to=${to}&order_by=period&group_by=${group_by}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(apiKey + ':')}` 
        },
    });

    const data = await response.json();

    return data.results;
} 

export async function getElectricUnitRates (product_code, tariff_code, from, to) {

    const url = `https://api.octopus.energy/v1/products/${product_code}/electricity-tariffs/${tariff_code}/standard-unit-rates/?period_from=${from}&period_to=${to}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let data = await response.json();

    data = data.results

    data = data?.filter(result => result.payment_method === 'DIRECT_DEBIT') || []

    return data;
}

export async function getElectricStandingCharges (product_code, tariff_code, from, to) {
    const url = `https://api.octopus.energy/v1/products/${product_code}/electricity-tariffs/${tariff_code}/standing-charges/?period_from=${from}&period_to=${to}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let data = await response.json();
    data = data.results

    data = data?.filter(result => result.payment_method === 'DIRECT_DEBIT') || []

    return data;
}

export async function getGasUsage(apiKey, mprn, serialNumber, from, to, group_by = 'day') {
    const url = `https://api.octopus.energy/v1/gas-meter-points/${mprn}/meters/${serialNumber}/consumption/?period_from=${from}&period_to=${to}&order_by=period&group_by=${group_by}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(apiKey + ':')}` 
        },
    });

    const data = await response.json();

    return data.results;
}

export async function getGasUnitRates (product_code, tariff_code, from, to) {
    const url = `https://api.octopus.energy/v1/products/${product_code}/gas-tariffs/${tariff_code}/standard-unit-rates/?period_from=${from}&period_to=${to}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let data = await response.json();

    data = data.results

    data = data?.filter(result => result.payment_method === 'DIRECT_DEBIT') || []

    return data;
}

export async function getGasStandingCharges (product_code, tariff_code, from, to) {
    const url = `https://api.octopus.energy/v1/products/${product_code}/gas-tariffs/${tariff_code}/standing-charges/?period_from=${from}&period_to=${to}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let data = await response.json();
    data = data.results

    data = data?.filter(result => result.payment_method === 'DIRECT_DEBIT') || []

    return data;
}