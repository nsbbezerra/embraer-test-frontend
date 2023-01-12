import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';
import ClientContext from '../context/client/client';
import { isAxiosError } from 'axios';
import { api } from '../configs/axios';
import { format } from 'date-fns';
import pt_br from 'date-fns/locale/pt-BR';

import LeafSvg from '../assets/leaf.svg';
import UserSvg from '../assets/user.svg';
import ReceiptSvg from '../assets/receipt.svg';

interface StatementsProps {
  id: number;
  client_id: number;
  total: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function MyAccount() {
  const toast = useToast();
  const { client } = useContext(ClientContext);

  const [statements, setStatements] = useState<StatementsProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function findStatements() {
      try {
        const { data } = await api.get(`/statements/${client.id}`);
        setStatements(data);
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

    findStatements();
  }, [client]);

  return (
    <Fragment>
      <Grid templateRows={'60px 1fr'}>
        <Header />

        <Container maxW={'2xl'} px={5} py={10}>
          <Grid
            rounded={'md'}
            shadow={'md'}
            bg={'white'}
            p={5}
            templateColumns={'100px 1fr'}
            gap={5}
          >
            <Box w={'100px'} h={'100px'}>
              <Image
                src={UserSvg}
                w={'100%'}
                h={'100%'}
                alt={'User avatar image'}
              />
            </Box>

            <Box>
              <Heading fontSize={'2xl'} color={'cyan.700'}>
                {client.name}
              </Heading>
              <Text fontSize={['xs', 'sm', 'md', 'md', 'md']}>
                Saldo em conta:{' '}
                <strong>
                  {client.balance.toLocaleString('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </Text>

              <HStack mt={2}>
                <Link to={'/withdraw'}>
                  <Button colorScheme={'green'}>Realizar saque</Button>
                </Link>

                <Link to={'/'}>
                  <Button>Sair</Button>
                </Link>
              </HStack>
            </Box>
          </Grid>

          <Box rounded={'md'} shadow={'md'} bg={'white'} p={5} mt={5}>
            <Flex justify={'center'} align={'center'} gap={3}>
              <Image
                src={ReceiptSvg}
                w={'30px'}
                h={'30px'}
                alt={'Receipts image'}
              />
              <Text fontWeight={'bold'} fontSize={'xl'} color={'cyan.700'}>
                EXTRATO BANCÁRIO
              </Text>
            </Flex>

            <Divider my={5} />

            {!statements.length ? (
              <Flex
                justify={'center'}
                align={'center'}
                direction={'column'}
                gap={3}
              >
                {isLoading ? (
                  <Spinner size={'lg'} />
                ) : (
                  <>
                    <Image
                      src={LeafSvg}
                      alt={'Leaf image'}
                      w={'100px'}
                      h={'100px'}
                    />

                    <Text>Nenhum extrato disponível para você!</Text>
                  </>
                )}
              </Flex>
            ) : (
              <Grid
                templateColumns={[
                  'repeat(1, 1fr)',
                  'repeat(2, 1fr)',
                  'repeat(2, 1fr)',
                  'repeat(2, 1fr)',
                  'repeat(2, 1fr)',
                ]}
                gap={2}
              >
                {statements.map((statement) => (
                  <Box
                    rounded={'md'}
                    borderWidth={'2px'}
                    borderStyle={'dashed'}
                    p={3}
                    textAlign={'center'}
                    _hover={{ bg: 'gray.50' }}
                    key={statement.id}
                  >
                    <Text>Número do recibo: {statement.id}</Text>

                    <Divider my={2} />

                    <Text>Valor sacado:</Text>
                    <Heading as={'h2'} fontSize={'2xl'}>
                      {Number(statement.total).toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Heading>

                    <Divider my={2} />

                    <Text>
                      {format(
                        new Date(statement.createdAt),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                        {
                          locale: pt_br,
                        }
                      )}
                    </Text>
                  </Box>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Grid>
    </Fragment>
  );
}
