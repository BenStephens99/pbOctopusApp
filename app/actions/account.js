'use server'

import { getPb } from "./auth/authActions"

export async function addAccount (accountNumber, api_key) {
    const pb = await getPb()

    const res = await pb.collection('accounts').create({
        accountNumber,
        api_key,
        admins: [pb.authStore.model.id]
    })
}

export async function getAccount() {
    const accountNumber = 'A-71F8EC8A'
    const apiKey = 'sk_live_fBXlB8cBJofd3PvO9O736ODA'

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