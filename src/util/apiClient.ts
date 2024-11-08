import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import NetworkError from '../errors/NetworkError';
import {ValidationErrors} from '../types/authTypes';

// API 에러 응답 DTO
interface ErrorResponseType {
  errors: ValidationErrors;
}

// API 설정 타입
interface ApiConfig extends AxiosRequestConfig {
  token?: string;
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
    (error: AxiosError<ErrorResponseType>) => {
      console.log('Error interceptor:', error.response?.data); // 디버깅용

      if (error.response) {
        const {status, data} = error.response;
        throw new NetworkError({
          code: status,
          message: error.message || '서버 오류가 발생했습니다.',
          errors: data.errors, // data.errors를 직접 사용
        });
      } else if (error.request) {
        console.log('Request error:', error.request); // 디버깅용
        throw new NetworkError({
          code: 0,
          message: '서버로부터 응답을 받지 못했습니다.',
        });
      } else {
        console.log('Error setup:', error.message); // 디버깅용
        throw new NetworkError({
          code: 0,
          message: '요청을 보내는 중 오류가 발생했습니다.',
        });
      }
    },
  );

  const request = async <ResponseType, RequestDTO = void>(
    config: ApiConfig & {data?: RequestDTO},
  ): Promise<ResponseType> => {
    if (config.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${config.token}`,
      };
    }

    const response: AxiosResponse<ResponseType> = await instance(config);
    return response.data;
  };

  return {
    get: <ResponseType, RequestDTO = void>(
      endpoint: string,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'GET',
        url: endpoint,
      }),

    post: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'POST',
        url: endpoint,
        data,
      }),

    delete: <ResponseType, RequestDTO = void>(
      endpoint: string,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'DELETE',
        url: endpoint,
      }),

    patch: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'PATCH',
        url: endpoint,
        data,
      }),

    put: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'PUT',
        url: endpoint,
        data,
      }),
  };
};
