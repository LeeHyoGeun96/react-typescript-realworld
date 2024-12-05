import {queryOptions} from '@tanstack/react-query';
import {GetProfileRequestParams} from '../types/profileTypes';
import {profileService} from '../services/profile.service';
import {QUERY_KEYS} from './constants/queryKeys';
import {setReactQueryTime} from '../util/setReactQueryTime';

export const profileQueryOptions = {
  getProfile: ({username, token}: GetProfileRequestParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.profile.getProfile({username, token}),
      queryFn: () => profileService.getProfile({username, token}),
      staleTime: setReactQueryTime('5/0'),
      gcTime: setReactQueryTime('10/0'),
    }),
};
