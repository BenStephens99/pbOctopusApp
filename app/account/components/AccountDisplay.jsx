'use client'
import { deleteAccount } from "@/app/actions/account"
import { useRouter } from "next/navigation"
import EditAccountModal from "./EditAccountModal"
import { Button } from "@nextui-org/button"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import InviteUserModal from "./InviteUserModal"

export default function Account(props) {
    const account = props.account
    const userId = props.userId

    const isAdmin = account.admins.find(admin => admin.id === userId) || false

    const router = useRouter()

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this account?')) {
            await deleteAccount(account.id)
            router.refresh()
        }
    }

    return (
        <Card>
            <CardHeader className="flex justify-between items-end">
                <div>
                    <h2>{account.name}</h2>
                    <p>{account.account_number}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {isAdmin ?
                        <Button color="danger" variant="flat" size="sm" onClick={handleDelete}>
                            Delete
                        </Button>
                        : null}
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {account.account_numbers.map(account_number => {
                        return (
                            <div key={account_number.id}>{account_number.number}</div>
                        )
                    })}
                </div>
            <Divider className="mt-3 mb-3"/>
                {account.admins.map(admin => {
                    return (
                        <PersonDisplay key={admin.id} person={admin} userId={userId} type={'admin'} />
                    )
                })}
                {account.users.map(user => {
                    return (
                        <PersonDisplay key={user.id} person={user} userId={userId} />
                    )
                })}
            </CardBody>
            {isAdmin ?
                <>
                    <Divider />
                    <CardFooter className="flex gap-2">
                        <InviteUserModal account={account} />
                        <EditAccountModal products={props.products} areaCodes={props.areaCodes} account={account} />
                    </CardFooter>
                </>
                :
                null
            }
        </Card>
    )
}

function PersonDisplay(props) {

    const person = props.person
    const userId = props.userId
    const type = props?.type || 'user'

    return (
        <div key={person.id} className="flex flex-col pb-3">
            <div className="flex justify-between">
                <div>
                    {type === 'admin' ?
                        <div>
                            <p>{person.name}</p>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="currentColor">
                                    <path d="M480-440q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0-80q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0 440q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-400Zm0-315-240 90v189q0 54 15 105t41 96q42-21 88-33t96-12q50 0 96 12t88 33q26-45 41-96t15-105v-189l-240-90Zm0 515q-36 0-70 8t-65 22q29 30 63 52t72 34q38-12 72-34t63-52q-31-14-65-22t-70-8Z" />
                                </svg>
                                Admin
                            </div>
                        </div>
                        :
                        <div>
                            <p>{person.name}</p>
                            <div className="text-sm text-gray-500 flex gap-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="currentColor">
                                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                                </svg>
                                User
                            </div>
                        </div>
                    }
                </div>
                {person.id === userId ?
                    <div className="text-sm flex gap-1 items-center text-green-500">
                        You
                        <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 -960 960 960" width="15" fill="currentColor">
                            <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                        </svg>
                    </div>
                    : null}
            </div>
        </div>
    )
}