import type { AppProps } from 'next/app';
import { Box, ChakraProvider, Container } from '@chakra-ui/react';

import theme from '@/themes';
import '@/themes/styles.css';
import { AuthProvider } from '@/context/AuthContext';
import MainSidebar from '@/components/layouts/MainSidebar';
import { useMemo } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const pageIsProtected = pageProps.protected;
  const isAuthenticationPage = pageProps.authPage;

  const content = useMemo(
    () => (
      <Container maxW="container.l" p={0} centerContent>
        {!isAuthenticationPage ? (
          <Component {...pageProps} />
        ) : (
          <Box w="80%">
            <Component {...pageProps} />
          </Box>
        )}
      </Container>
    ),
    [Component, isAuthenticationPage, pageProps]
  );

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider isPageProtected={pageIsProtected} isAuthenticationPage={isAuthenticationPage}>
        {!isAuthenticationPage ? <MainSidebar>{content}</MainSidebar> : content}
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
