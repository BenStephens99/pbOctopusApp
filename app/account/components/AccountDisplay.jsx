'use client'
import { deleteAccount } from "@/app/actions/account"
import { useRouter } from "next/navigation"
import EditAccountModal from "./EditAccountModal"

export default function Account (props) {
    const account = props.account
    const userId = props.userId
    const products = props.products
    
    const productName = products.find(product => product.code === account.product_code).display_name

    const isAdmin = account.admins.find(admin => admin.id === userId)

    const router = useRouter()

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this account?')) {
            await deleteAccount(account.id)
            router.refresh()
        }
    }

    return (
        <div className="rounded-sm shadow-md p-4 bg-white flex flex-col gap-4">
            <div>
                <h3>{account.name}</h3>
                <p>{account.account_number}</p>
            </div>
            <div>
                <h4>Product Name: </h4>
                <p>{productName}</p>
            </div>
            <div className="grid grid-cols-2">
                <div>
                    <h4>{account.admins.length > 1 ? 'Admins' : 'Admin'}</h4>
                    {account.admins.map(admin => {
                        return (
                            <div key={admin.id} className="flex flex-col gap-1">
                                <p>{admin.name}</p>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <h4>Users</h4>
                    {account.users.map(user => {
                        return (
                            <div key={user.id} className="flex flex-col gap-1">
                                <p>{user.name}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            {isAdmin ?
                <div className="flex gap-2 mt-auto justify-end">
                    <EditAccountModal products={products} account={account} />
                    <button onClick={handleDelete}>Delete</button>
                </div>
                :
                null
            }
        </div>
    )
}