import {useRouteError, useNavigate} from 'react-router-dom';
import NetworkError from '../errors';

export default function ErrorLayout() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (NetworkError.isNetworkError(error)) {
    const isServerError = error.code >= 500;
    const isAuthError = [401, 403].includes(error.code);

    return (
      <div className="error-container">
        <h2>오류가 발생했습니다 ({error.code})</h2>
        <p>{error.message}</p>
        {error.errors && (
          <ul className="error-details">
            {Object.entries(error.errors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        )}
        <div className="error-actions">
          {!isServerError &&
            !isAuthError && ( // 서버 에러나 인증 에러가 아닐 때만 뒤로가기
              <button onClick={() => navigate(-1)}>이전 페이지로</button>
            )}
          {isServerError && ( // 서버 에러일 때는 새로고침만
            <button onClick={() => window.location.reload()}>새로고침</button>
          )}
          {isAuthError && ( // 인증 에러일 때는 로그인으로
            <button onClick={() => navigate('/login')}>로그인하기</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="error-container">
      <h1>예상치 못한 오류가 발생했습니다</h1>
      <p>잠시 후 다시 시도해주세요</p>
      <button onClick={() => navigate('/')}>홈으로 가기</button>
    </div>
  );
}
