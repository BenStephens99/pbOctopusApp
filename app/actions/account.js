'use server'

import { getPb } from "./auth/authActions"
import { getUser } from "./users";

export async function getAccounts() {
    const pb = await getPb();

    const records = await pb.collection('accounts').getFullList({
        sort: '-created',
    });

    return records;
}

export async function getAccountsWithUsers() {
    const pb = await getPb();

    const records = await pb.collection('accounts').getFullList({
        sort: '-created',
    });

    for (let i = 0; i < records.length; i++) {
        for (let j = 0; j < records[i].admins.length; j++) {
            const user = await getUser(records[i].admins[j]);
            records[i].admins[j] = user;
        }

        for (let j = 0; j < records[i].users.length; j++) {
            const user = await getUser(records[i].users[j]);
            records[i].users[j] = user;
        }
    }

    return records;
}

export async function addAccount(name, account_number, api_key) {
    const pb = await getPb()

    const res = await pb.collection('accounts').create({
        name,
        account_number,
        api_key,
        admins: [pb.authStore.model.id]
    })

    return res
}

export async function deleteAccount(id) {
    const pb = await getPb()

    const res = await pb.collection('accounts').delete(id)

    return res
}

export async function updateAccount(id, name, account_number, product_code, api_key, admins, users) {
    const pb = await getPb()

    const res = await pb.collection('accounts').update(id, {
        name,
        account_number,
        api_key,
        product_code,
        admins: admins.map(admin => admin.id),
        users: users.map(user => user.id)
    })

    return res
}