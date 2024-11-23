import {Component, ErrorInfo, ReactNode} from 'react';
import NetworkError from '../errors';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRefresh = () => {
    this.setState({hasError: false, error: null});
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (NetworkError.isNetworkError(this.state.error)) {
        const error = this.state.error;
        return (
          <div className="error-container">
            <h1>오류가 발생했습니다 ({error.code})</h1>
            <p>{error.message}</p>
            {error.errors && error.code === 422 && (
              <ul className="validation-errors">
                {Object.entries(error.errors).map(([field, messages]) => (
                  <li key={field}>
                    {field}: {messages.join(', ')}
                  </li>
                ))}
              </ul>
            )}
            <div className="error-actions">
              {/* 서버 에러(500번대)일 때는 새로고침 버튼만 표시 */}
              {error.code >= 500 && (
                <button onClick={this.handleRefresh}>새로고침</button>
              )}
              {/* 인증 에러(401, 403)일 때는 로그인 버튼 표시 */}
              {[401, 403].includes(error.code) && (
                <button onClick={() => (window.location.href = '/login')}>
                  로그인하기
                </button>
              )}
              {/* 그 외 에러는 이전 페이지로 가기 버튼 표시 */}
              {error.code < 500 && ![401, 403].includes(error.code) && (
                <button onClick={() => window.history.back()}>
                  이전 페이지로
                </button>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="error-container">
          <h1>치명적인 오류가 발생했습니다</h1>
          <p>앱을 다시 로드해주세요</p>
          <button onClick={this.handleRefresh}>새로고침</button>
        </div>
      );
    }

    return this.props.children;
  }
}
