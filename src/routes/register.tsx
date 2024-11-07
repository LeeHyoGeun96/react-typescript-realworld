import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useActionData } from 'react-router-dom';
import NetworkError from '../errors/NetworkError';
import AuthForm from '../components/AuthForm';
import { authQueryOptions } from '../queryOptions/authQueryOptions';
import { SignupFormDataType } from '../types/authTypes';

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const rawSignUpData = Object.fromEntries(formData);

    const signUpData: SignupFormDataType = {
      username: String(rawSignUpData.username),
      email: String(rawSignUpData.email),
      password: String(rawSignUpData.password),
    };

    if (!signUpData.username || !signUpData.email || !signUpData.password) {
      return new NetworkError({
        code: 400,
        message: '모든 필드는 필수입니다.',
      });
    }

    try {
      await queryClient.fetchQuery(
        authQueryOptions.signup({ user: signUpData }),
      );
      return redirect('/login');
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

interface RegisterPageProps {}

const RegisterPage = ({}: RegisterPageProps) => {
  const errors = useActionData() as NetworkError | undefined;
  console.log(errors);

  return <AuthForm type="register" errors={errors} />;
};

export default RegisterPage;
