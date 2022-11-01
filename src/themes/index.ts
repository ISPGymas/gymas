import { extendTheme, theme as base } from '@chakra-ui/react'

const confirmRing = {
  _focus: {
    ring: 2,
    ringColor: 'confirmColor.500',
  },
}

const theme = extendTheme({
  colors: {
    confirmColor: {
      50: '#f5fee5',
      100: '#e1fbb2',
      200: '#cdf781',
      300: '#b8ee56',
      400: '#a2e032',
      500: '#8ac919',
      600: '#71ab09',
      700: '#578602',
      800: '#3c5e00',
      900: '#203300',
    },
  },
  fonts: {
    heading: `Montserrat, ${base.fonts?.heading}`,
    body: `Montserrat, ${base.fonts?.body}`,
  },
  components: {
    Button: {
      variants: {
        primary: {
          ...confirmRing,
          backgroundColor: 'confirmColor.500',
          _hover: {
            backgroundColor: 'confirmColor.600',
          },
          _active: {
            backgroundColor: 'confirmColor.700',
          },
        },
        secondary: {
          ...confirmRing,
          backgroundColor: 'teal.300',
          _hover: {
            backgroundColor: 'teal.400',
          },
          _active: {
            teal: 'confirmColor.500',
          },
        },
        alarm: {
          ...confirmRing,
          backgroundColor: 'red.500',
          _hover: {
            backgroundColor: 'red.600',
          },
          _active: {
            teal: 'confirmColor.500',
          },
        },
      },
    },
  },
})

export default theme
