import { QueryClient } from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
} from 'react-router-dom';
import { authService } from '../services/auth';
import NetworkError from '../errors/NetworkError';

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

    try {
      // API 호출을 통해 사용자 등록
      const user = await authService.signUp({ user: signUpData });

      queryClient.setQueryData(['user'], user);

      return redirect('/login');
    } catch (error) {
      // 에러 처리
      // 예를 들어, 에러 메시지를 반환할 수 있음
      if (error instanceof NetworkError) {
        console.dir(error);
        return error;
      }
      console.log(error);
      throw new Error('알 수 없는 네트워크 오류가 발생했습니다.');
    }
  };

interface RegisterPageProps {}

const RegisterPage = ({}: RegisterPageProps) => {
  const actionData = useActionData() as { info: string | null };
  if (actionData?.info) {
    console.log(actionData.info);
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
            </p>

            <ul className="error-messages">
              <li>That email is already taken</li>
            </ul>

            <Form method="post">
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="username"
                  placeholder="Username"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
