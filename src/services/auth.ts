import NetworkError from '../errors/NetworkError';
import { apiClient } from '../util/api';

const handleError = (error: unknown) => {
  if (error instanceof NetworkError) {
    throw error;
  }
  throw error;
};

export const authService = {
  signUp: async (data: SignupRequest) => {
    console.log(data);
    try {
      return await apiClient.post<SignupResponse, SignupRequest>(
        '/users',
        data,
      );
    } catch (error) {
      handleError(error);
    }
  },

  login: async (data: LoginRequest) => {
    try {
      return await apiClient.post<LoginResponse, LoginRequest>(
        '/users/login',
        data,
      );
    } catch (error) {
      handleError(error);
    }
  },

  getCurrentUser: async (token: string) => {
    try {
      return await apiClient.get<User>('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      handleError(error);
    }
  },
};
