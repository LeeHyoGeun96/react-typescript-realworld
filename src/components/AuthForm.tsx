import { Form } from 'react-router-dom';
import NetworkError from '../errors/NetworkError';
import { ErrorDisplay } from './ErrorDisplay';

interface AuthFormProps {
  type: 'login' | 'register';
  errors?: NetworkError;
  onSubmit?: (data: FormData) => void;
}

const AuthForm = ({ type, errors }: AuthFormProps) => {
  const isLogin = type === 'login';
  const title = isLogin ? 'Sign in' : 'Sign up';
  const switchText = isLogin ? 'Need an account?' : 'Have an account?';
  const switchLink = isLogin ? '/register' : '/login';

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{title}</h1>
            <p className="text-xs-center">
              <a href={switchLink}>{switchText}</a>
            </p>

            <ErrorDisplay errors={errors} />
            <Form method="post">
              {!isLogin && (
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                  />
                </fieldset>
              )}
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                {title}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
