import { ActionFunctionArgs, redirect, useActionData } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { QueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth';
import NetworkError from '../errors/NetworkError';
import { useBoundStore } from '../store';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    if (!formData.get('email') || !formData.get('password')) {
      return { errors: { 'email or password': ['All fields are required'] } };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { user } = await authService.login({ user: { email, password } });
      useBoundStore.getState().login(user, user.token);
      queryClient.setQueryData(['user'], user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      return redirect('/');
    } catch (error) {
      console.dir(error);
      if (NetworkError.isNetworkError(error)) {
        if (error.code === 422 || error.code === 403) {
          return (
            error.errors || { 'email or password': ['Invalid credentials'] }
          );
        }
      }
      throw error;
    }
  };

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
  const errors = useActionData() as ValidationErrors | undefined;

  return <AuthForm type="login" errors={errors} />;
};

export default LoginPage;
