'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAccount } from "@/app/actions/account";

export default function AddAccountModal() {

    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleAddAccount = async (e) => {
        e.preventDefault();
        await addAccount(name, accountNumber, apiKey);
        setModalOpen(false);
        router.refresh()
    }

    return (
        <>
            <button onClick={() => setModalOpen(true)}>Add Account</button>
            {!modalOpen ?
                null
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <h4>Add Account</h4>
                        <form onSubmit={handleAddAccount}>
                            <div className="flex flex-col">
                                <label>Name</label>
                                <input type="text" placeholder="Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Account Number</label>
                                <input type="text" placeholder="Account Number"
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>API Key</label>
                                <input type="text" placeholder="API Key"
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}