import React from 'react';
import { Flex, Icon, Link, FlexProps } from '@chakra-ui/react';
import { ReactText } from 'react';
import NextLink from 'next/link';

interface NavItemProps extends FlexProps {
  icon: any;
  link: string;
  children: ReactText;
}

export const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  return (
    <Link as={NextLink} href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
