'use client'

import { deleteHouse } from "@/app/actions/houses";
import { useRouter } from "next/navigation";
import { useState } from "react";

import EditHouseModal from "./EditHouseModal";

export default function House(props) {
    const router = useRouter();

    const [editingHouse, setEditingHouse] = useState(false);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this house?')) {
            await deleteHouse(props.house.id);
            router.refresh();
        }
    }

    const toggleModal = () => {
        setEditingHouse(!editingHouse);
    }

    return (
        <>  
            {editingHouse ? 
                <EditHouseModal 
                    toggleModal={toggleModal}
                    house={props.house}
                    electricTariffs={props.electricTariffs}
                    gasTariffs={props.gasTariffs}
                /> 
            : ''}
            <div className="p-4 flex flex-col gap-2 shadow-md rounded bg-white">
                <div className="flex gap-2">
                    <h3>{props.house.name}</h3>
                    <button className="ml-auto" onClick={toggleModal}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
                <div className="flex flex-col">
                    <h4>Electric</h4>
                    <p>Mpan: {props.house.elec_mpan}</p>
                    <p>Serial Number: {props.house.elec_serial_num}</p>
                    <p>Tariff: {props.electricTariffs.find((tariff) => tariff.id === props.house.electric_tariff)?.name || ''}</p>
                </div>
                <div className="flex flex-col">
                    <h4>Gas</h4>
                    <p>Mprn: {props.house.gas_mprn}</p>
                    <p>Serial Number: {props.house.gas_serial_num}</p>
                    <p>Tariff: {props.gasTariffs.find((tariff) => tariff.id === props.house.gas_tariff)?.name || ''}</p>
                </div>
            </div>
        </>
    );
}