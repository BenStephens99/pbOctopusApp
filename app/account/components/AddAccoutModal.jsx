'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addAccount } from "@/app/actions/account";
import { Button } from "@nextui-org/button";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem
} from "@nextui-org/react";

export default function AddAccountModal(props) {

    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [name, setName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [areaCode, setAreaCode] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [product, setProduct] = useState('');

    useEffect(() => {
        setName('');
        setAccountNumber('');
        setApiKey('');
        setProduct('');
    }, [isOpen]);

    const handleAddAccount = async (e) => {
        await addAccount(name, accountNumber, apiKey, product, areaCode);
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
                        <Select
                            label="Product"
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            {props.products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Area"
                            onChange={(e) => setAreaCode(e.target.value)}
                        >
                            {props.areaCodes.map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                    {area.name}
                                </SelectItem>
                            ))}
                        </Select>
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