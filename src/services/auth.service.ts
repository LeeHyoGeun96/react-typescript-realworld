import { apiClient } from '../util/api';
import {
  SignupResponse,
  LoginResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  SignupDTO,
  SignupParams,
  LoginRequestParams,
  LoginDTO,
} from '../types/authTypes';

export const authService = {
  signUp: (data: SignupParams) => {
    return apiClient.post<SignupResponse, SignupDTO>('/users', data);
  },

  login: (data: LoginRequestParams) => {
    return apiClient.post<LoginResponse, LoginDTO>('/users/login', data);
  },

  getCurrentUser: (token: string) => {
    return apiClient.get<User, void>('/user', {
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
