import { GetProfileRequest, GetProfileResponse } from '../types/profileTypes';
import { apiClient } from '../util/api';

export const profileService = {
  getProfile: ({ username, token }: GetProfileRequest) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return apiClient.get<GetProfileResponse>(`/profiles/${username}`, {
      headers,
    });
  },
};
