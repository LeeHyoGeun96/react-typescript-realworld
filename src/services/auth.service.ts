import { apiClient } from '../util/api';

export const authService = {
  signUp: (data: SignupRequest) => {
    return apiClient.post<SignupResponse, SignupRequest>('/users', data);
  },

  login: (data: LoginRequest) => {
    return apiClient.post<LoginResponse, LoginRequest>('/users/login', data);
  },

  getCurrentUser: (token: string) => {
    return apiClient.get<User>('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateUser: (data: UpdateUserRequest, token: string) => {
    return apiClient.put<UpdateUserResponse, UpdateUserRequest>('/user', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
