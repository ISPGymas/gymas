import { Box, Button, Divider, Heading, useDisclosure } from '@chakra-ui/react';
import { Membership } from '@/types/gym';
import moment from 'moment';
import { CancelMembershipConfirmationModal } from './CancelMembershipConfirmationModal';

const MembershipComponent = ({
  membership,
  onStatusChange,
}: {
  membership: Membership;
  onStatusChange: (membershipId: string, status: string) => void;
}) => {
  const { onToggle, isOpen, onClose } = useDisclosure();

  const handleStatusChange = (membershipId: string, status: string) => () => {
    onStatusChange?.(membershipId, status);
  };

  return (
    <Box maxW="sm" minW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
      <Box p="6">
        <Box textAlign="center">
          <Heading size="md">{membership.type}</Heading>
        </Box>
        <Box pt={3}>
          <Heading size="md">From:</Heading>
          <Heading size="sm">{moment(new Date(membership.start_date.seconds * 1000)).format('ll')}</Heading>
        </Box>
        <Box pt={3}>
          <Heading size="md">To:</Heading>
          <Heading size="sm">{moment(new Date(membership.end_date.seconds * 1000)).format('ll')}</Heading>
        </Box>
        <Box pt={3}>
          <Heading size="md">Status:</Heading>
          <Heading size="sm" color={membership.status === 'Active' ? 'green' : 'red'}>
            {membership.status}
          </Heading>
        </Box>
        {membership.status === 'Active' && (
          <Box pt={2}>
            <Button color="error" isFullWidth variant="alarm" onClick={onToggle}>
              Cancel membership
            </Button>
          </Box>
        )}
        <CancelMembershipConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleStatusChange(membership.id, 'Inactive')}
        />
      </Box>
    </Box>
  );
};

export default MembershipComponent;
