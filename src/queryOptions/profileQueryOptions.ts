import {queryOptions} from '@tanstack/react-query';
import {GetProfileRequestParams} from '../types/profileTypes';
import {profileService} from '../services/profile.service';
import {QUERY_KEYS} from './constants/queryKeys';

export const profileQueryOptions = {
  getProfile: ({username, token}: GetProfileRequestParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.getProfile({username, token}),
      queryFn: () => profileService.getProfile({username, token}),
      staleTime: 1000 * 60 * 5,
    }),
};
