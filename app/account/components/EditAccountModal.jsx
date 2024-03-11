'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/actions/account";
import { Button } from "@nextui-org/button";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
    Select, SelectItem, Input,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip,
} from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";


export default function EditAccountModal(props) {
    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [name, setName] = useState(props.account.name);
    const [accountNumber, setAccountNumber] = useState(props.account.account_number);
    const [productCode, setProductCode] = useState(props.account.product_code);
    const [apiKey, setApiKey] = useState(props.account.api_key);
    const [admins, setAdmins] = useState(props.account.admins);
    const [users, setUsers] = useState(props.account.users);

    const products = props.products

    const handleRemoveUser = async (userId) => {
        const newUsers = users.filter(user => user.id !== userId);
        setUsers(newUsers);
    }

    const promoteToAdmin = async (userId) => {
        const newAdmins = [...admins, users.find(user => user.id === userId)];
        const newUsers = users.filter(user => user.id !== userId);
        setAdmins(newAdmins);
        setUsers(newUsers);
    }

    const handleEditAccount = async () => {
        await updateAccount(props.account.id, name, accountNumber, productCode, apiKey, admins, users);
        onOpenChange();
        router.refresh()
    }

    return (
        <>
            <Button color="primary" className="ml-auto" variant="ghost" onPress={onOpen}>Edit</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Edit Account</ModalHeader>
                            <ModalBody>
                                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                <Input label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                                <Input label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                <Select
                                    label="Select your product"
                                    onChange={(e) => setProductCode(e.target.value)}
                                    selectedKeys={[productCode]}
                                >
                                    {products.map((product) => (
                                        <SelectItem key={product.code} value={product.code}>
                                            {product.display_name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Table 
                                    classNames={{
                                        wrapper: 'bg-default-100',
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn className="bg-default">Name</TableColumn>
                                        <TableColumn className="bg-default">Role</TableColumn>
                                        <TableColumn className="text-right bg-default">Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map(admin => {
                                            return (
                                                <TableRow key={admin.id}>
                                                    <TableCell>{admin.name}</TableCell>
                                                    <TableCell>
                                                        <Chip color="primary" size="sm">Admin</Chip>
                                                    </TableCell>
                                                    <TableCell>

                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {users.map(user => {
                                            return (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>
                                                        <Chip color="default" size="sm">User</Chip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end">
                                                            <Tooltip content="Promote user to admin">
                                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                                    <RiAdminFill onClick={() => promoteToAdmin(user.id)} />
                                                                </span>
                                                            </Tooltip>
                                                            <Tooltip color="danger" content="Delete user">
                                                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                    <MdDelete onClick={() => handleRemoveUser(user.id)} />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                                <Button color="primary" onPress={handleEditAccount}>Save</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* {!modalOpen ?
                null
                :
                <div className="modal">
                    <div className="modal-body max-w-sm">
                        <h3 className="mb-2">Edit Account</h3>
                        <form onSubmit={handleEditAccount}>
                            <div className="flex flex-col">
                                <label>Name</label>
                                <input type="text" placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Account Number</label>
                                <input type="text" placeholder="Account Number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>API Key</label>
                                <input type="text" placeholder="API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Product Code</label>
                                <select
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                >
                                    <option value="">Select a product</option>
                                    {products.map(product => {
                                        return (
                                            <option key={product.code} value={product.code}>{product.display_name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div>
                                <h4>Admins</h4>
                                {admins.map(admin => {
                                    return (
                                        <div key={admin.id} className="flex flex-col gap-1">
                                            <p>{admin.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <h4>Users</h4>
                                <div className="flex flex-col gap-2">
                                    {users.map(user => {
                                        return (
                                            <div key={user.id}
                                                className="flex items-center justify-between gap-1 p-2 rounded-md shadow-sm bg-gray-100"
                                            >
                                                <p>{user.name}</p>
                                                <div className="flex gap-2">
                                                    <button className="small" onClick={() => handleRemoveUser(user.id)}>Remove</button>
                                                    <button className="small" onClick={() => promoteToAdmin(user.id)}>Make Admin</button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>

                        </form>
                    </div>
                </div>
            } */}
        </>
    );
}