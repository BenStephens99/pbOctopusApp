'use server'
import { getOrganisation } from "./organisations"
import { getPb } from "./auth/authActions"

export async function getKey (keyId) {
    const pb = await getPb()
    const key = await pb.collection('keys').getOne(keyId)

    return key.key
}