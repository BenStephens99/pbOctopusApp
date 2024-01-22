import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://139.162.247.126:80')

export const currentUser = pb.authStore.model

console.log(currentUser)