import {
  Button,
  Divider,
  Flex,
  Grid,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Fragment, useContext, useState } from 'react';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';

import Logo from '../assets/bank.svg';
import { api } from '../configs/axios';
import ClientContext from '../context/client/client';
import { isAxiosError } from 'axios';

interface ClientProps {
  id: number;
  name: string;
  balance: string;
}

export default function Login() {
  const navigateTo = useNavigate();
  const toast = useToast();

  const { setClient } = useContext(ClientContext);

  const [clientName, setClientName] = useState<string>('John Doe');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function storeClientToSession(client: ClientProps) {
    const loggedClient = {
      balance: Number(client.balance),
      id: client.id,
      name: client.name,
    };

    sessionStorage.setItem('client', JSON.stringify(loggedClient));
    setClient(loggedClient);

    navigateTo('/my-account');
  }

  async function login() {
    try {
      setIsLoading(true);
      const { data } = await api.post('/login', {
        name: clientName,
      });

      toast({
        title: 'Success',
        description: 'Login successfuly',
        status: 'success',
        position: 'bottom-right',
      });

      storeClientToSession(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error) && error.message) {
        toast({
          title: 'Error',
          description: error.response?.data.errorMessage || error.message,
          status: 'error',
          position: 'bottom-right',
        });
      }
    }
  }

  return (
    <Fragment>
      <Grid
        w={'100vw'}
        h={'100vh'}
        overflow={'hidden'}
        templateRows={'60px 1fr'}
      >
        <Header />

        <Flex align={'center'} justify={'center'} w={'100%'} h={'100%'} p={5}>
          <Flex
            w={'100%'}
            maxW={'md'}
            rounded={'md'}
            shadow={'md'}
            bg={'white'}
            p={5}
            justify={'center'}
            align={'center'}
            direction={'column'}
          >
            <Image src={Logo} w="100px" h={'100px'} alt="My Bank logo" />

            <Divider my={5} />

            <Text>Acesse sua conta:</Text>

            <Input
              size={'lg'}
              focusBorderColor={'cyan.700'}
              placeholder={'Seu nome'}
              mt={5}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <Button
              size={'lg'}
              colorScheme={'green'}
              mt={5}
              w={'100%'}
              onClick={() => login()}
              isLoading={isLoading}
            >
              Login
            </Button>
          </Flex>
        </Flex>
      </Grid>
    </Fragment>
  );
}
