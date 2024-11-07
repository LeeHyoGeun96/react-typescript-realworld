import {
  FollowUserRequestParams,
  FollowUserResponse,
  GetProfileRequestParams,
  GetProfileResponse,
  UnfollowUserRequestParams,
  UnfollowUserResponse,
} from '../types/profileTypes';
import { apiClient } from '../util/api';

export const profileService = {
  getProfile: ({ username, token }: GetProfileRequestParams) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return apiClient.get<GetProfileResponse, void>(`/profiles/${username}`, {
      headers,
    });
  },

  followUser: ({ username, token }: FollowUserRequestParams) => {
    const headers = { Authorization: `Bearer ${token}` };
    return apiClient.post<FollowUserResponse, void>(
      `/profiles/${username}/follow`,
      undefined,
      { headers },
    );
  },

  unfollowUser: ({ username, token }: UnfollowUserRequestParams) => {
    const headers = { Authorization: `Bearer ${token}` };
    return apiClient.delete<UnfollowUserResponse, void>(
      `/profiles/${username}/follow`,
      { headers },
    );
  },
};
