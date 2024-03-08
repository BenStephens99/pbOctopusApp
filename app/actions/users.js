'use server'

import { getPb } from "./auth/authActions"

export async function getUser (id) {
    const pb = await getPb()

    const res = await pb.collection('users').getOne(id)

    return res
}