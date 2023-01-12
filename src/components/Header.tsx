import {
  Box,
  Container,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Fragment, useContext, useEffect } from 'react';

import Logo from '../assets/bank.svg';
import ClientContext from '../context/client/client';

export function Header() {
  const { client, setClient } = useContext(ClientContext);

  useEffect(() => {
    const sessionClient = sessionStorage.getItem('client');

    if (sessionClient) {
      setClient(JSON.parse(sessionClient));
    }
  }, []);

  return (
    <Fragment>
      <Box
        h="100%"
        shadow={'md'}
        bg="white"
        position={'sticky'}
        top={0}
        zIndex={1000}
      >
        <Container
          maxW={'5xl'}
          h="100%"
          display={'flex'}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <HStack spacing={3}>
            <Image src={Logo} w="40px" h={'40px'} alt="My Bank logo" />
            <Heading
              fontSize={['md', '2xl', '2xl', '2xl', '2xl']}
              color="cyan.700"
            >
              My Bank
            </Heading>
          </HStack>

          <HStack spacing={5}>
            <Stack spacing={-1}>
              <Text
                fontSize={['xs', 'sm', 'sm', 'sm', 'sm']}
                fontWeight="light"
                color="gray.600"
              >
                Saldo:
              </Text>
              <Text
                fontWeight={'bold'}
                color={Number(client.balance) < 0 ? 'red.600' : 'green.600'}
                fontSize={['sm', 'md', 'md', 'md', 'md']}
              >
                {client.balance.toLocaleString('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
            </Stack>
          </HStack>
        </Container>
      </Box>
    </Fragment>
  );
}
