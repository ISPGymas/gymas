import { IconButton, Link, useBreakpointValue } from '@chakra-ui/react'
import { JSXElementConstructor, ReactElement } from 'react'

export const ButtonLink = ({
  link,
  name,
}: {
  link: string | undefined
  name: ReactElement<any, string | JSXElementConstructor<any>>
}) => {
  const iconSize = useBreakpointValue({ base: '24px', lg: '28px' })
  return (
    <Link href={link}>
      <IconButton
        aria-label=''
        icon={name}
        variant='unstyled'
        fontSize={iconSize}
      ></IconButton>
    </Link>
  )
}
