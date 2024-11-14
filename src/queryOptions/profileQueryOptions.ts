import {queryOptions} from '@tanstack/react-query';
import {GetProfileRequestParams} from '../types/profileTypes';
import {profileService} from '../services/profile.service';

export const profileQueryOptions = {
  getProfile: ({username, token}: GetProfileRequestParams) =>
    queryOptions({
      queryKey: token ? ['profile', username, token] : ['profile', username],
      queryFn: () => profileService.getProfile({username, token}),
      staleTime: 1000 * 60 * 5,
    }),
};
