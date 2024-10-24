import { queryOptions } from '@tanstack/react-query';
import { authService } from '../services/auth';

export const authQueryOptions = {
  signup: (data: SignupRequest) =>
    queryOptions({
      queryKey: ['signup'],
      queryFn: () => authService.signUp(data),
    }),

  login: (data: LoginRequest) =>
    queryOptions({
      queryKey: ['login'],
      queryFn: () => authService.login(data),
    }),

  getCurrentUser: (token: string) =>
    queryOptions({
      queryKey: ['currentUser', token],
      queryFn: () => authService.getCurrentUser(token),
    }),
};
