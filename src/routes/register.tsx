import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useActionData } from 'react-router-dom';
import NetworkError from '../errors/NetworkError';
import AuthForm from '../components/AuthForm';
import { authQueryOptions } from '../queryOptions/authQueryOptions';

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
      return { errors: ['All fields are required'] };
    }

    try {
      await queryClient.fetchQuery(
        authQueryOptions.signup({ user: signUpData }),
      );
      return redirect('/login');
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        if (error.code === 422 || error.code === 403) {
          console.log(error.errors);
          return error.errors;
        }
      }
      throw error;
    }
  };

interface RegisterPageProps {}

const RegisterPage = ({}: RegisterPageProps) => {
  const errors = useActionData() as ValidationErrors | undefined;
  console.log(errors);

  return <AuthForm type="register" errors={errors} />;
};

export default RegisterPage;
