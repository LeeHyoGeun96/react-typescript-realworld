import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import NetworkError from '../errors/NetworkError';

interface ErrorResponse {
  errors: ValidationErrors;
}

export const createApi = (url: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status, statusText } = error.response;
        const errorData = error.response.data as ErrorResponse;
        const networkError = new NetworkError({
          statusText: statusText,
          code: status,
          message: error?.message,
          errors: errorData?.errors,
        });
        throw networkError;
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        const networkError = new NetworkError({
          statusText: 'No Response',
          code: 0,
          message: '서버로부터 응답을 받지 못했습니다.',
        });
        throw networkError;
      } else {
        // 요청 설정 중 오류가 발생한 경우
        const networkError = new NetworkError({
          statusText: 'Request Error',
          code: 0,
          message: '요청을 보내는 중 오류가 발생했습니다.',
        });
        throw networkError;
      }
    },
  );

  const request = async <ResponseType, RequestType = undefined>(
    config: AxiosRequestConfig & { data?: RequestType },
  ): Promise<ResponseType> => {
    const response: AxiosResponse<ResponseType> = await instance(config);
    return response.data;
  };

  return {
    get: <ResponseType>(endpoint: string, config?: AxiosRequestConfig) =>
      request<ResponseType>({
        ...config,
        method: 'GET',
        url: endpoint,
      }),
    post: <ResponseType, RequestType>(
      endpoint: string,
      data?: RequestType,
      config?: AxiosRequestConfig,
    ) =>
      request<ResponseType, RequestType>({
        ...config,
        method: 'POST',
        url: endpoint,
        data,
      }),
    delete: <ResponseType>(endpoint: string, config?: AxiosRequestConfig) =>
      request<ResponseType>({
        ...config,
        method: 'DELETE',
        url: endpoint,
      }),

    patch: <ResponseType, RequestType>(
      endpoint: string,
      data?: RequestType,
      config?: AxiosRequestConfig,
    ) =>
      request<ResponseType, RequestType>({
        ...config,
        method: 'PATCH',
        url: endpoint,
        data,
      }),
  };
};
