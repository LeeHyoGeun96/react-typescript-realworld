import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default ErrorPage;
