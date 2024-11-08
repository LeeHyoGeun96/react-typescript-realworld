import {queryOptions} from '@tanstack/react-query';
import {GetProfileRequestParams} from '../types/profileTypes';
import {profileService} from '../services/profile.service';

export const profileQueryOptions = {
  getProfile: (data: GetProfileRequestParams) =>
    queryOptions({
      queryKey: ['profile', data.username],
      queryFn: () => profileService.getProfile(data),
      staleTime: 1000 * 60, // 1분
      refetchInterval: 1000 * 30, // 30초마다 자동 갱신
    }),
};
