import {Outlet} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useBoundStore} from '../store';
import {QueryClient} from '@tanstack/react-query';
import {authQueryOptions} from '../queryOptions/authQueryOptions';

export const loader = (queryClient: QueryClient) => async () => {
  const token = useBoundStore.getState().token;
  const loginFn = useBoundStore.getState().login;
  const logoutFn = useBoundStore.getState().logout;

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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pb-16 lg:pb-0">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default RootPage;
