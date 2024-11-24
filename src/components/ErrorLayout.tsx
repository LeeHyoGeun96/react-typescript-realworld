import {useRouteError, useNavigate} from 'react-router-dom';
import NetworkError from '../errors';

export default function ErrorLayout() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (NetworkError.isNetworkError(error)) {
    const isServerError = error.code >= 500;
    const isAuthError = [401, 403].includes(error.code);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            오류가 발생했습니다 ({error.code})
          </h2>
          <p className="text-gray-600 text-center mb-6">{error.message}</p>

          {error.errors && (
            <ul className="space-y-2 text-sm text-red-500 mb-6">
              {Object.entries(error.errors).map(([key, value]) => (
                <li key={key} className="flex flex-col">
                  <span className="font-medium">{key}</span>
                  <span className="text-gray-600">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-center space-x-4">
            {!isServerError && !isAuthError && (
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                이전 페이지로
              </button>
            )}

            {isServerError && (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                새로고침
              </button>
            )}

            {isAuthError && (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                로그인하기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          예상치 못한 오류가 발생했습니다
        </h1>
        <p className="text-gray-600 text-center mb-6">
          잠시 후 다시 시도해주세요
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
