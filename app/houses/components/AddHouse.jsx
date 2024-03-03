'use client'

import { useState, useEffect } from "react"
import { addHouse } from "@/app/actions/houses";
import { useRouter } from "next/navigation";

export default function AddHouse(props) {
    const [adding, setAdding] = useState(false);

    const [name, setName] = useState("");
    const [electricMpan, setElectricMpan] = useState("");
    const [electricSerial, setElectricSerial] = useState("");
    const [gasMprn, setGasMprn] = useState("");
    const [gasSerial, setGasSerial] = useState("");
    const [organisation, setOrganisation] = useState("");

    useEffect(() => {
        if (props.organisations.length === 1) {
            setOrganisation(props.organisations[0].id);
        }
    }, []);

    const router = useRouter();

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            electricMpan,
            electricSerial,
            gasMprn,
            gasSerial,
            organisation
        }
        try {
            await addHouse(formData);
            router.refresh();
            setAdding(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={() => setAdding(true)}>Add House</button>
            {!adding ? ''
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <h3>Add House</h3>
                        <form onSubmit={handleAdd}>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="House Name"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label>Electric</label>
                            <input
                                type="text"
                                placeholder="Electric mpan"
                                onChange={(e) => setElectricMpan(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Electric Serial Number"
                                onChange={(e) => setElectricSerial(e.target.value)}
                            />
                            <label>Gas</label>
                            <input
                                type="text"
                                placeholder="Gas mprn"
                                onChange={(e) => setGasMprn(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Gas Serial Number"
                                onChange={(e) => setGasSerial(e.target.value)}
                            />
                            {props.organisations.length > 1 ?
                                <>
                                    <label>Organisation</label>
                                    <select
                                        required
                                        onChange={(e) => setOrganisation(e.target.value)}
                                    >
                                        <option value="">Select Organisation</option>
                                        {props.organisations.map((organisation) => (
                                            <option key={organisation.id} value={organisation.id}>{organisation.name}</option>
                                        ))}
                                    </select>
                                </>
                            : ""}
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setAdding(false)}>Cancel</button>
                                <button type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}