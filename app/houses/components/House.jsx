'use client'

import { deleteHouse } from "@/app/actions/houses";
import { useRouter } from "next/navigation";

export default function House (props) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this house?')) {
            await deleteHouse(props.house.id);
            router.refresh();
        }
    }
    return (
        <div className="p-4 shadow-md rounded bg-white">
            <div className="flex gap-4 justify-between">
                <h3>{props.house.name}</h3>
                <button onClick={handleDelete}>Delete</button>
            </div>
            <h4>Electric</h4>
            <p>Mpan: {props.house.elec_mpan}</p>
            <p>Serial Number: {props.house.elec_serial_num}</p>
            <h4>Gas</h4>
            <p>Mprn: {props.house.gas_mprn}</p>
            <p>Serial Number: {props.house.gas_serial_num}</p>
            <h4>Key</h4>
            <p>API Key: {props.house.api_key}</p>
        </div>
    );
}