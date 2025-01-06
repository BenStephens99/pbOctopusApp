'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addAccount } from '@/app/actions/account';
import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { createInvitation } from '@/app/actions/invitations';

export default function InviteUserModal(props) {
  const account = props.account;

  const router = useRouter();

  const [email, setEmail] = useState('');

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const handleInviteUser = async () => {
    const res = await createInvitation(email, account);
    if (res) {
      onOpenChange();
      setEmail('');
    }
  };
  return (
    <>
      <Button onClick={onOpen} className="w-fit">
        Invite User
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Invite User</ModalHeader>
          <ModalBody>
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleInviteUser} auto>
              Invite User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
