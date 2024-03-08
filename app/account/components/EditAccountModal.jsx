'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/actions/account";

export default function EditAccountModal(props) {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    const [name, setName] = useState(props.account.name);
    const [accountNumber, setAccountNumber] = useState(props.account.account_number);
    const [productCode, setProductCode] = useState(props.account.product_code);
    const [apiKey, setApiKey] = useState(props.account.api_key);
    const [admins, setAdmins] = useState(props.account.admins);
    const [users, setUsers] = useState(props.account.users);

    const products = props.products

    const handleRemoveUser = async (userId) => {
        const newUsers = users.filter(user => user.id !== userId);
        setUsers(newUsers);
    }

    const promoteToAdmin = async (userId) => {
        const newAdmins = [...admins, users.find(user => user.id === userId)];
        const newUsers = users.filter(user => user.id !== userId);
        setAdmins(newAdmins);
        setUsers(newUsers);
    }

    const handleEditAccount = async (e) => {
        e.preventDefault();
        await updateAccount(props.account.id, name, accountNumber, productCode, apiKey, admins, users);
        setModalOpen(false);
        router.refresh()
    }

    return (
        <>
            <button onClick={() => setModalOpen(true)}>Edit</button>
            {!modalOpen ?
                null
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <h3 className="mb-2">Edit Account</h3>
                        <form onSubmit={handleEditAccount}>
                            <div className="flex flex-col">
                                <label>Name</label>
                                <input type="text" placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Account Number</label>
                                <input type="text" placeholder="Account Number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>API Key</label>
                                <input type="text" placeholder="API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Product Code</label>
                                <select
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                >
                                    <option value="">Select a product</option>
                                    {products.map(product => {
                                        return (
                                            <option key={product.code} value={product.code}>{product.display_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div>
                                <h4>Admins</h4>
                                {admins.map(admin => {
                                    return (
                                        <div key={admin.id} className="flex flex-col gap-1">
                                            <p>{admin.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <h4>Users</h4>
                                <div className="flex flex-col gap-2">
                                    {users.map(user => {
                                        return (
                                            <div key={user.id} 
                                                className="flex items-center justify-between gap-1 p-2 rounded-md shadow-sm bg-gray-100"
                                            >
                                                <p>{user.name}</p>
                                                <div className="flex gap-2">
                                                    <button className="small" onClick={() => handleRemoveUser(user.id)}>Remove</button>
                                                    <button className="small" onClick={() => promoteToAdmin(user.id)}>Make Admin</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>

                        </form>
                    </div>
                </div>
            }
        </>
    );
}