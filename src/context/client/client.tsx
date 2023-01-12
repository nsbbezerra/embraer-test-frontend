import { createContext, Dispatch, SetStateAction, useState } from 'react';

interface Client {
  id: number;
  name: string;
  balance: number;
}

type PropsClientContext = {
  client: Client;
  setClient: Dispatch<SetStateAction<Client>>;
};

const DEFAULT_VALUE: PropsClientContext = {
  client: {
    id: 0,
    name: '',
    balance: 0,
  },
  setClient: () => {},
};

const ClientContext = createContext<PropsClientContext>(DEFAULT_VALUE);

const ClientContextProvider = ({ children }: any) => {
  const [client, setClient] = useState(DEFAULT_VALUE.client);

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export { ClientContextProvider };

export default ClientContext;
