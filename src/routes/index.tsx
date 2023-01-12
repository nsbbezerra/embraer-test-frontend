import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/login';
import MyAccount from '../pages/myAccount';
import Withdraw from '../pages/withdraw';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/my-account', element: <MyAccount /> },
  { path: '/withdraw', element: <Withdraw /> },
]);

export { router };
