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
import { MdDelete, MdAdd, MdEdit, MdSave } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";


export default function EditAccountModal(props) {
    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [name, setName] = useState(props.account.name);
    const [accountNumbers, setAccountNumbers] = useState(props.account.account_numbers || []);
    const [accountNumbersToDelete, setAccountNumbersToDelete] = useState([]);
    const [apiKey, setApiKey] = useState(props.account.api_key);
    const [admins, setAdmins] = useState(props.account.admins);
    const [users, setUsers] = useState(props.account.users);
    const [productCode, setProductCode] = useState(props.account.product_code.id);
    const [areaCode, setAreaCode] = useState(props.account.area_code.id);
    const [editingAccount, setEditingAccount] = useState({ id: '', number: '' });

    const handleRemoveUser = (userId) => {
        const newUsers = users.filter(user => user.id !== userId);
        setUsers(newUsers);
    }

    const promoteToAdmin = (userId) => {
        const newAdmins = [...admins, users.find(user => user.id === userId)];
        const newUsers = users.filter(user => user.id !== userId);
        setAdmins(newAdmins);
        setUsers(newUsers);
    }

    const handleEditAccount = async () => {
        saveEditingAccountNumber();
        await updateAccount(props.account.id, name, accountNumbers, accountNumbersToDelete, apiKey, productCode, areaCode, admins, users);
        onOpenChange();
        router.refresh()
    }

    const handleRemoveAccount = (accountNumberId) => {
        const newAccountNumbers = accountNumbers.filter(accountNumber => accountNumber.id !== accountNumberId);
        setAccountNumbers(newAccountNumbers);

        if (accountNumberId.startsWith('new')) {
            return;
        }

        setAccountNumbersToDelete([...accountNumbersToDelete, accountNumberId]);
        setEditingAccount({ id: '', number: '' });
    }

    const saveEditingAccountNumber = () => {
        const newAccountNumbers = accountNumbers.map(accountNumber => {
            if (accountNumber.id === editingAccount.id) {
                return { ...accountNumber, number: editingAccount.number }
            }
            return accountNumber;
        });
        setAccountNumbers(newAccountNumbers);
        setEditingAccount({ id: '', number: '' });
    }

    const addAccountNumber = () => {
        const id = `new-${Math.random().toString(36).substring(7)}`;
        const newAccountNumber = { id, number: '' }; 
        setAccountNumbers([...accountNumbers, newAccountNumber]);

        if (editingAccount.id) {
            saveEditingAccountNumber();
        }

        setEditingAccount({ id, number: '' });
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
                                <Table classNames={{ wrapper: 'bg-default-100' }}>
                                    <TableHeader>
                                        <TableColumn className="bg-default">Account Number</TableColumn>
                                        <TableColumn className="text-right bg-default">Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {accountNumbers.map(accountNumber => {
                                            return (
                                                <TableRow key={accountNumber.id}>
                                                    <TableCell>
                                                        {editingAccount.id === accountNumber.id ?
                                                            <Input variant="bordered" value={editingAccount.number} onChange={(e) => setEditingAccount({ ...editingAccount, number: e.target.value })} />
                                                            :
                                                            <Input variant="faded" value={accountNumber.number} isDisabled />
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-end">
                                                            {editingAccount.id === accountNumber.id ?
                                                                <Tooltip content="Save changes">
                                                                    <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                                                        <MdSave onClick={saveEditingAccountNumber} />
                                                                    </span>
                                                                </Tooltip>
                                                                :
                                                                <Tooltip content="Edit account number">
                                                                    <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                                                        <MdEdit onClick={() => setEditingAccount({ id: accountNumber.id, number: accountNumber.number })} />
                                                                    </span>
                                                                </Tooltip>
                                                            }
                                                            <Tooltip color="danger" content="Remove user">
                                                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                                    <MdDelete onClick={() => handleRemoveAccount(accountNumber.id)} />
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        <TableRow>
                                            <TableCell>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Button size="sm" color="primary" variant="bordered" onClick={addAccountNumber}>
                                                        <span>Add</span>
                                                        <MdAdd className="ml-2" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Input label="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                                <Select label="Product" selectedKeys={[productCode]} onChange={(e) => setProductCode(e.target.value)}>
                                    {props.products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select label="Area" selectedKeys={[areaCode]} onChange={(e) => setAreaCode(e.target.value)}>
                                    {props.areaCodes.map((area) => (
                                        <SelectItem key={area.id} value={area.id}>
                                            {area.name}
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
                                                            <Tooltip color="danger" content="Remove user">
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
        </>
    );
}