import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { customTheme } from './styles/style';
import ClientGlobalContext from './context/client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClientGlobalContext>
      <ChakraProvider resetCSS theme={customTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </ClientGlobalContext>
  </React.StrictMode>
);
