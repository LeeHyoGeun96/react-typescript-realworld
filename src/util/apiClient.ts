import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import NetworkError from '../errors/NetworkError';

export const createApi = (baseURL: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const { status, statusText } = error.response;
        const networkError = new NetworkError({
          statusTest: statusText,
          code: status,
          message: error.message,
          response: error.response,
        });
        throw networkError;
      }
      console.log(error);
      throw error;
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
      request<ResponseType>({ ...config, method: 'GET', url: endpoint }),
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
      request<ResponseType>({ ...config, method: 'DELETE', url: endpoint }),
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
