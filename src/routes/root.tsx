import {Outlet} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useUserStore} from '../store/userStore';
import {QueryClient} from '@tanstack/react-query';
import {authQueryOptions} from '../queryOptions/authQueryOptions';

export const loader = (queryClient: QueryClient) => async () => {
  const {token, login: loginFn, logout: logoutFn} = useUserStore.getState();

  if (!token) {
    logoutFn();
    return null;
  }

  try {
    const response = await queryClient.ensureQueryData(
      authQueryOptions.getCurrentUser(token),
    );

    const {user} = response;
    loginFn(user, token);
    return null;
  } catch (error) {
    logoutFn();
    throw error;
  }
};

interface RootPageProps {}

const RootPage = ({}: RootPageProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootPage;
