'use client'

import { addAccount } from "@/app/actions/account";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAccount() {

    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    const [accountNumber, setAccountNumber] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleAddAccount = async (e) => {
        e.preventDefault();
        await addAccount(accountNumber, apiKey);
        router.refresh()
    }

    return (
        <>
            {!modalOpen ?
                <button onClick={() => setModalOpen(true)}>Add Account</button>
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <h3>Add Account</h3>
                        <form onSubmit={handleAddAccount}>
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
                            <button type="submit" className="btn btn-primary">Add Account</button>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}