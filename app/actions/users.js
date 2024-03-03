'use server'

import { getPb } from "./auth/authActions"

export async function getUsers (ids) {
    const pb = await getPb();

    ids = ids || [];
    ids = ids.map((id) => `id = "${id}"`);

    let filter = ids.join(' || ');

    if (!filter) {
        filter = 'id = ""';
    }
    
    const users = await pb.collection('users').getFullList({
        sort: '-created',
        filter,
    });

    return users.map((user) => user.name);
}

export async function getUsersNames (ids) {
    const pb = await getPb();

    ids = ids || [];
    ids = ids.map((id) => `id = "${id}"`);

    let filter = ids.join(' || ');

    if (!filter) {
        filter = 'id = ""';
    }

    const users = await pb.collection('users').getFullList({
        sort: '-created',
        filter
    });

    return users.map((user) => user.name);
}

export async function getUser(id) {
    const pb = await getPb();
    
    const user = await pb.collection('users').getOne(id);
    
    return user;
}