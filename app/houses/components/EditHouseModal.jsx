'use client'

import { useState } from "react";
import { updateHouse } from "@/app/actions/houses";
import { useRouter } from "next/navigation";

export default function EditHouseModal(props) {

    const router = useRouter();

    const [name, setName] = useState(props.house.name);
    const [elecMpan, setElecMpan] = useState(props.house.elec_mpan);
    const [elecSerialNum, setElecSerialNum] = useState(props.house.elec_serial_num);
    const [elecTariff, setElecTariff] = useState(props.house.electric_tariff);
    const [gasMprn, setGasMprn] = useState(props.house.gas_mprn);
    const [gasSerialNum, setGasSerialNum] = useState(props.house.gas_serial_num);
    const [gasTariff, setGasTariff] = useState(props.house.gas_tariff);

    const handleEdit = async (e) => {
        e.preventDefault()

        const data = {
            id: props.house.id,
            name,
            elecMpan,
            elecSerialNum,
            elecTariff,
            gasMprn,
            gasSerialNum,
            gasTariff
        }
        
        await updateHouse(data);
        props.toggleModal();
        router.refresh();
    }

    return (
        <div className="modal">
            <div className="modal-body max-w-96">
                <form onSubmit={handleEdit}>
                    <h4>Name</h4>   
                    <input
                        type="text"
                        placeholder="House Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />            
                    <div>
                        <h4>Electric</h4>
                        <div className="flex flex-col">
                            <label>MPAN</label>
                            <input
                                type="text"
                                placeholder="MPAN"
                                required
                                value={elecMpan}
                                onChange={(e) => setElecMpan(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Serial Number</label>
                            <input
                                type="text"
                                placeholder="Serial Number"
                                required
                                value={elecSerialNum}
                                onChange={(e) => setElecSerialNum(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Tariff</label>
                            <select 
                                value={elecTariff}
                                onChange={(e) => setElecTariff(e.target.value)}
                            >
                                <option value=''>Select a tariff</option>
                                {props.electricTariffs.map((tariff) => (
                                    <option key={tariff.id} value={tariff.id}>{tariff.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h4>Gas</h4>
                        <div className="flex flex-col">
                            <label>MPRN</label>
                            <input
                                type="text"
                                placeholder="MPRN"
                                required
                                value={gasMprn}
                                onChange={(e) => setGasMprn(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Serial Number</label>
                            <input
                                type="text"
                                placeholder="Serial Number"
                                required
                                value={gasSerialNum}
                                onChange={(e) => setGasSerialNum(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Tariff</label>
                            <select 
                                value={gasTariff}
                                onChange={(e) => setGasTariff(e.target.value)}
                            >
                                <option value=''>Select a tariff</option>
                                {props.gasTariffs.map((tariff) => (
                                    <option key={tariff.id} value={tariff.id}>{tariff.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button onClick={props.toggleModal}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}