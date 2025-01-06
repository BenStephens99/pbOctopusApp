'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { BsBellFill } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { acceptInvitation } from '@/app/actions/invitations';
import { useRouter } from 'next/navigation';

export default function UserInvites(props) {
  const router = useRouter();
  const invites = props.invitations || [];

  const [invite, setInvite] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (invite) {
      onOpen();
    }
  }, [invite]);

  const handleAcceptInvitation = async () => {
    await acceptInvitation(invite.id);
    setInvite('');
    onOpenChange();
    router.refresh();
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button endContent={<BsBellFill />} variant="solid" color="primary">
            <span className="hidden sm:block">Invitations</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          {invites.map((invite) => {
            return (
              <DropdownItem
                key={invite.id}
                description={invite.info.fromEmail}
                onClick={() => {
                  setInvite(invite);
                }}
              >
                {invite.info.accountName}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Invitation</ModalHeader>
              <ModalBody>
                <div className="text-center">
                  <p>{invite.info.fromEmail}</p>
                  <p>{invite.info.accountName}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Decline
                </Button>
                <Button color="primary" onPress={handleAcceptInvitation}>
                  Accept
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
