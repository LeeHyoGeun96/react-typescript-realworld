import { apiClient } from '../util/api';

export const authService = {
  signUp: (data: SignupRequest) => {
    return apiClient.post<SignupResponse, SignupRequest>('/users', data);
  },

  login: (data: LoginRequest) => {
    return apiClient.post<LoginResponse, LoginRequest>('/users/login', data);
  },

  getCurrentUser: (): Promise<User> => {
    return apiClient.get<User>('/user');
  },
};
