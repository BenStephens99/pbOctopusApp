'use server'

import { getPb } from "./auth/authActions"
import { getUsers } from "./users";
import { getAccountNumbers } from "./accountNumbers";
import { getOctopusAccounts } from "./octopus";
import { addAccountNumber, updateAccountNumber } from "./accountNumbers";
import { getAreaCode } from "./areaCodes";
import { getProduct } from "./products";

export async function getAccounts() {
    const pb = await getPb();

    const records = await pb.collection('accounts').getFullList({
        sort: '-created',
    });

    return records;
}

export async function getAccountsWithData() {
    const pb = await getPb();

    const records = await pb.collection('accounts').getFullList({
        sort: '-created',
    });

    for (const account of records) {
        account.account_numbers = await getAccountNumbers([account.account_numbers]);
        account.admins = await getUsers(account.admins);
        account.users = await getUsers(account.users);
        account.octopus = await getOctopusAccounts(account);
        account.area_code = await getAreaCode(account.area_code);
        account.product_code = await getProduct(account.product_code);
    }

    return records;
}

export async function getAccount(id) {
    const pb = await getPb();

    const record = await pb.collection('accounts').getOne(id);

    record.area_code = await getAreaCode(record.area_code);
    record.product_code = await getProduct(record.product_code);

    return record;
}

export async function addAccount(name, account_number, api_key, product_code, area_code) {
    const pb = await getPb()

    try {
        const accountNumber = await addAccountNumber(account_number)
    
        const res = await pb.collection('accounts').create({
            name,
            account_numbers: [accountNumber.id],
            api_key,
            product_code,
            area_code,
            admins: [pb.authStore.model.id]
        })
    
        return res
    } catch (e) {
        console.error(e)
        return 'error'
    }
}

export async function deleteAccount(id) {
    const pb = await getPb()

    const res = await pb.collection('accounts').delete(id)

    return res
}

export async function updateAccount(id, name, account_numbers, account_numbers_to_delete, api_key, product_code, area_code, admins, users) {
    const pb = await getPb()

    for (const account_number of account_numbers_to_delete) {
        await pb.collection('account_numbers').delete(account_number)
    }

    for (const account_number of account_numbers) {
        if (account_number.id.startsWith('new')) {
            const res = await addAccountNumber(account_number.number)
            account_number.id = res.id
        } else {
            await updateAccountNumber(account_number.id, account_number.number)
        }
    }

    const res = await pb.collection('accounts').update(id, {
        name,
        account_numbers: account_numbers.map(account_number => account_number.id),
        api_key,
        product_code,
        area_code,
        admins: admins.map(admin => admin.id),
        users: users.map(user => user.id)
    })

    return res
}

