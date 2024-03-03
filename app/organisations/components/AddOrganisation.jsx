'use client'

import { useState } from "react";
import { addOrganisation } from "@/app/actions/organisations";
import { useRouter } from "next/navigation";

export default function AddOrganisation(props) {

    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");

    const router = useRouter();

    const handleAdd = async (e) => {
        e.preventDefault();
        await addOrganisation({ name });
        setAdding(false);
        router.refresh();
    }

    return (
        <div>
            <button onClick={() => setAdding(true)}>Add Organisation</button>
            {!adding ? ''
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <form onSubmit={handleAdd}>
                            <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Organisation Name"
                                required
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setAdding(false)}>Cancel</button>
                                <button type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}