'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAccount } from "@/app/actions/account";
import { Button } from "@nextui-org/button";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input
} from "@nextui-org/react";

export default function AddAccountModal() {

    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleAddAccount = async (e) => {
        await addAccount(name, accountNumber, apiKey);
        onOpenChange()
        router.refresh()
    }

    return (
        <>
            <Button onClick={onOpen} className="w-fit">Add Account</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Add Account</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                        <Input
                            label="API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onOpenChange}>Close</Button>
                        <Button color="primary" onPress={handleAddAccount}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </>
    );
}