import { ActionFunctionArgs, redirect, useActionData } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { QueryClient } from '@tanstack/react-query';
import NetworkError from '../errors/NetworkError';
import { authQueryOptions } from '../queryOptions/authQueryOptions';
import { useBoundStore } from '../store';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const loginFn = useBoundStore.getState().login;
    if (!formData.get('email') || !formData.get('password')) {
      return { errors: { 'email or password': ['All fields are required'] } };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await queryClient.fetchQuery(
        authQueryOptions.login({ user: { email, password } }),
      );
      const { user } = response;
      loginFn(user, user.token);

      return redirect('/');
    } catch (error) {
      console.dir(error);
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error; // 예상하지 못한 에러는 다시 던짐
    }
  };

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  const errors = useActionData() as NetworkError | undefined;

  return <AuthForm type="login" errors={errors} />;
};

export default LoginPage;
