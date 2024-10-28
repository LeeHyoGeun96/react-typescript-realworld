import { queryOptions } from '@tanstack/react-query';
import { authService } from '../services/auth';

export const authQueryOptions = {
  signup: (data: SignupRequest) =>
    queryOptions({
      queryKey: ['auth', 'signup'],
      queryFn: () => authService.signUp(data),
      staleTime: 0,
      gcTime: 0,
    }),

  login: (data: LoginRequest) =>
    queryOptions({
      queryKey: ['auth', 'login'],
      queryFn: () => authService.login(data),
      staleTime: 0,
      gcTime: 0,
    }),

  getCurrentUser: (token: string) =>
    queryOptions({
      queryKey: ['auth', 'currentUser', token],
      queryFn: () => authService.getCurrentUser(token),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    }),
};
