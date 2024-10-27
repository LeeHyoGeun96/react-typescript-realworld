class NetworkError extends Error {
  code: number;
  statusText: string;
  errors?: ValidationErrors;

  static errorMessages: Record<number, string> = {
    401: '인증이 필요합니다. 로그인 정보를 확인해주세요.',
    403: '접근 권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    429: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.',
    422: '요청이 유효성 검사에 실패했습니다',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    502: '잘못된 게이트웨이입니다.',
    503: '서버가 현재 이용 불가능합니다. 잠시 후 다시 시도해주세요.',
    504: '게이트웨이 타임아웃이 발생했습니다. 네트워크를 확인해주세요.',
  };

  constructor({
    code,
    message,
    statusText,
    errors,
  }: {
    code: number;
    message: string;
    statusText: string;
    errors?: ValidationErrors;
  }) {
    const errorMessage = NetworkError.errorMessages[code] || message;
    super(errorMessage);
    this.name = 'NetworkError';
    this.code = code;
    this.statusText = statusText;
    this.errors = errors;
  }

  static isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
  }
}

export default NetworkError;
