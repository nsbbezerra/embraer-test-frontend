import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Fragment, useContext, useState } from 'react';
import { Header } from '../components/Header';

import WithdrawSvg from '../assets/money.svg';
import { Link } from 'react-router-dom';
import ClientContext from '../context/client/client';
import { isAxiosError } from 'axios';
import { api } from '../configs/axios';

import OneHundred from '../assets/100_front.jpeg';
import Fifty from '../assets/50_front.jpeg';
import Twenty from '../assets/20_front.jpeg';
import Ten from '../assets/10_front.jpeg';

interface BanknotesProps {
  id: number;
  banknoteValue: number;
  amount: number;
}

export default function Withdraw() {
  const toast = useToast();
  const { client, setClient } = useContext(ClientContext);

  const [valueToWithdraw, setValueToWithdraw] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [banknotes, setBanknotes] = useState<BanknotesProps[]>([]);

  async function getNewBalanceValue() {
    try {
      const { data } = await api.get(`/getBalance/${client.id}`);

      console.log(data);
    } catch (error) {
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

  async function withdraw() {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/withdraw/${client.id}`, {
        amount: valueToWithdraw,
      });

      setBanknotes(data.banknotes);

      toast({
        title: 'Success',
        description: 'Withdrawal made successfully',
        status: 'success',
        position: 'bottom-right',
      });
      setIsLoading(false);

      const updatedClient = {
        id: client.id,
        balance: data.balance,
        name: client.name,
      };

      setClient(updatedClient);
      sessionStorage.setItem('client', JSON.stringify(updatedClient));

      getNewBalanceValue();
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

  function handleImages(banknoteValue: number) {
    switch (banknoteValue) {
      case 100:
        return OneHundred;
      case 50:
        return Fifty;
      case 20:
        return Twenty;
      case 10:
        return Ten;
      default:
        return Ten;
    }
  }

  return (
    <Fragment>
      <Grid templateRows={'60px 1fr'}>
        <Header />

        <Container maxW={'xl'} px={5} py={10}>
          <Flex
            justify={'center'}
            align={'center'}
            direction={'column'}
            bg={'white'}
            rounded={'md'}
            p={5}
            shadow={'md'}
          >
            <Image
              src={WithdrawSvg}
              alt={'Withdraw icon'}
              w={'100px'}
              h={'100px'}
            />

            <Divider my={5} />

            <Text textAlign={'center'}>Insira um valor para o saque:</Text>
            <InputGroup size={'lg'} mt={3}>
              <InputLeftAddon children={'R$'} />
              <Input
                type={'number'}
                focusBorderColor={'cyan.700'}
                value={valueToWithdraw}
                onChange={(e) => setValueToWithdraw(parseFloat(e.target.value))}
              />
            </InputGroup>

            <Button
              w={'100%'}
              size={'lg'}
              colorScheme={'green'}
              mt={5}
              isLoading={isLoading}
              onClick={() => withdraw()}
            >
              Sacar
            </Button>
          </Flex>

          <Box bg={'white'} rounded={'md'} p={5} shadow={'md'} mt={5}>
            {!!banknotes.length && (
              <>
                <Heading
                  fontSize={'lg'}
                  color={'cyan.700'}
                  textAlign={'center'}
                >
                  RETIRE SEU DINHEIRO AQUI
                </Heading>

                <Divider my={5} />

                <Stack spacing={3}>
                  {banknotes.map((banknote) => (
                    <Box w={'100%'} position={'relative'} key={banknote.id}>
                      <Image
                        src={handleImages(banknote.banknoteValue)}
                        w={'100%'}
                        alt={`Image of 100 reais`}
                      />
                      <Flex
                        position={'absolute'}
                        top={5}
                        left={5}
                        bg={'whiteAlpha.900'}
                        rounded={'full'}
                        p={2}
                        w={['50px', '70px', '70px', '70px', '70px']}
                        h={['50px', '70px', '70px', '70px', '70px']}
                        zIndex={100}
                        justify={'center'}
                        align={'center'}
                        shadow={'md'}
                      >
                        <Text
                          fontSize={['lg', '2xl', '2xl', '2xl', '2xl']}
                          fontWeight={'bold'}
                          color={'red.600'}
                        >
                          {banknote.amount}x
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </Stack>

                <Divider my={5} />
              </>
            )}

            <Link to={'/my-account'}>
              <Button w={'100%'}>Ir para minha conta</Button>
            </Link>
          </Box>
        </Container>
      </Grid>
    </Fragment>
  );
}
