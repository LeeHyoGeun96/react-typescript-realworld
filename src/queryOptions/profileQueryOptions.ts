import { queryOptions } from '@tanstack/react-query';
import { GetProfileRequest } from '../types/profileTypes';
import { profileService } from '../services/profie.service';

export const profileQueryOptions = {
  getProfile: (data: GetProfileRequest) =>
    queryOptions({
      queryKey: ['profile', data.username],
      queryFn: () => profileService.getProfile(data),
    }),
};
