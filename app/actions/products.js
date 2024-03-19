'use server'

import { getPb } from "./auth/authActions";

export async function getProducts() {
    const pb = await getPb();

    const records = await pb.collection('products').getFullList({
        sort: 'name',
    });

    return records;
}

export async function getProduct(productId) {
    const pb = await getPb();

    const record = await pb.collection('products').getOne(productId);

    return record;
}