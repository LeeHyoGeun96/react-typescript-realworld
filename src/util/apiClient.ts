import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import NetworkError from '../errors/NetworkError';
import { ValidationErrors } from '../types/authTypes';

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
        const { status, data } = error.response;
        const errorData = data as ErrorResponse | undefined;
        throw new NetworkError({
          code: status,
          message: error.message || '서버 오류가 발생했습니다.',
          errors: errorData?.errors,
        });
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        throw new NetworkError({
          code: 0,
          message: '서버로부터 응답을 받지 못했습니다.',
        });
      } else {
        // 요청 설정 중 오류가 발생한 경우
        throw new NetworkError({
          code: 0,
          message: '요청을 보내는 중 오류가 발생했습니다.',
        });
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
    put: <ResponseType, RequestType>(
      endpoint: string,
      data?: RequestType,
      config?: AxiosRequestConfig,
    ) =>
      request<ResponseType, RequestType>({
        ...config,
        method: 'PUT',
        url: endpoint,
        data,
      }),
  };
};
