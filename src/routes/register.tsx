import { QueryClient } from '@tanstack/react-query';
import { ActionFunctionArgs, redirect, useActionData } from 'react-router-dom';
import { authService } from '../services/auth';
import NetworkError from '../errors/NetworkError';
import AuthForm from '../components/AuthForm';

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
      // API 호출을 통해 사용자 등록
      const user = await authService.signUp({ user: signUpData });
      queryClient.setQueryData(['user'], user);
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
