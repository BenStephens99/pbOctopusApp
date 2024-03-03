'use client'

import { deleteOrganisation } from "@/app/actions/organisations"
import { useRouter } from "next/navigation";

export default function Organisation (props) {
    
    const router = useRouter();

    const handleDelete = async (e) => {
        if (confirm("Are you sure you want to delete this organisation?")) {
            e.preventDefault();
            await deleteOrganisation(props.organisation.id);
            router.refresh();
        }
    }

    return (
        <div className="p-4 shadow-md rounded flex flex-col gap-4 bg-white">
            <div className="flex gap-4 justify-between">
                <h3>{props.organisation.name}</h3>
                <button onClick={handleDelete}>Delete</button>
            </div>
            <div>
                <h4>Members</h4>
                {props.organisation.users.map((user) => (
                    <p key={user}>{user}</p>
                ))}
            </div>
            <div>
                <h4>Houses</h4>
                {props.organisation.houses.map((house) => (
                    <p key={house}>{house}</p>
                ))}
            </div>
        </div>
    );
}