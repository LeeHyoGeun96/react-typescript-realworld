import {Form, Link} from 'react-router-dom';
import NetworkError from '../errors/NetworkError';
import {ErrorDisplay} from './ErrorDisplay';

interface AuthFormProps {
  type: 'login' | 'register';
  errors?: NetworkError;
  onSubmit?: (data: FormData) => void;
}

const AuthForm = ({type, errors}: AuthFormProps) => {
  const isLogin = type === 'login';
  const title = isLogin ? 'Sign in' : 'Sign up';
  const switchText = isLogin ? 'Need an account?' : 'Have an account?';
  const switchLink = isLogin ? '/register' : '/login';

  return (
    <main className="auth-page py-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <section className="w-full max-w-md">
            <header className="mb-8">
              <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-center mt-2">
                <Link
                  to={switchLink}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {switchText}
                </Link>
              </p>
            </header>

            <ErrorDisplay errors={errors} />

            <Form method="post" className="space-y-6">
              {!isLogin && (
                <fieldset className="mb-4">
                  <input
                    className="block w-full px-3 py-2 text-lg 
                      text-gray-900 dark:text-white
                      bg-white dark:bg-gray-800 
                      border border-gray-300 dark:border-gray-700 
                      rounded-md
                      focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                      focus:border-green-500 dark:focus:border-green-400
                      placeholder-gray-400 dark:placeholder-gray-500"
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                  />
                </fieldset>
              )}
              <fieldset className="mb-4">
                <input
                  className="block w-full px-3 py-2 text-lg 
                    text-gray-900 dark:text-white
                    bg-white dark:bg-gray-800 
                    border border-gray-300 dark:border-gray-700 
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                    focus:border-green-500 dark:focus:border-green-400
                    placeholder-gray-400 dark:placeholder-gray-500"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset className="mb-4">
                <input
                  className="block w-full px-3 py-2 text-lg 
                    text-gray-900 dark:text-white
                    bg-white dark:bg-gray-800 
                    border border-gray-300 dark:border-gray-700 
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400
                    focus:border-green-500 dark:focus:border-green-400
                    placeholder-gray-400 dark:placeholder-gray-500"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button
                className="w-full py-2 px-4 text-lg 
                  text-white
                  bg-green-600 hover:bg-green-700 
                  dark:bg-green-500 dark:hover:bg-green-600
                  rounded-md 
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-green-500 dark:focus:ring-green-400
                  float-right"
                type="submit"
              >
                {title}
              </button>
            </Form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AuthForm;
