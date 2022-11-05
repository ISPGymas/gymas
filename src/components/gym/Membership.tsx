import { Box, Heading } from '@chakra-ui/react';
import { Membership } from '@/types/gym';
import moment from 'moment';

const MembershipComponent = ({ membership }: { membership: Membership }) => {
  return (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
      <Box p="6">
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
          <Heading size="md">
            {' '}
            {`From ${moment(new Date(membership.start_date.seconds * 1000)).format('ll')} to ${moment(
              new Date(membership.end_date.seconds * 1000)
            ).format('ll')}`}
          </Heading>
        </Box>
        <Box>
          <Heading size="lg">{membership.type}</Heading>
        </Box>
        <Heading size="lg">Membership status:</Heading>
        <Box>
          <Heading size="md">{membership.status}</Heading>
        </Box>
      </Box>
    </Box>
  );
};

export default MembershipComponent;
