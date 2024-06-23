'use server'

import { getPb } from "./auth/authActions";

export async function getInvitations() {
    const pb = await getPb()

    const records = await pb.collection('invitations').getList(1, 50)

    return records.items || [];
}

export async function getAccountInvitations(account_id) {  
    const pb = await getPb()

    const records = await pb.collection('invitations').getList(1, 50, {
        filter: `account = "${account_id}"`
    })

    return records.items || [];
}

export async function createInvitation(email, account) {
    const pb = await getPb()

    const res = await pb.collection('invitations').create({
        from: pb.authStore.model.id,
        to: email,
        account: account.id,
        info: {
            fromEmail: pb.authStore.model.email,
            accountName: account.name
        }
    })

    if (res) {
        return true
    }
    return false
}

export async function acceptInvitation(invitationId) {
    const pb = await getPb()

    //add user to account   
    const invitation = await pb.collection('invitations').getOne(invitationId)

    const account = await pb.collection('accounts').getOne(invitation.account)

    console.log(account)

    await pb.collection('accounts').update(account.id, {
        users: [...account.users, pb.authStore.model.id]
    })

    await pb.collection('invitations').delete(invitationId)
}