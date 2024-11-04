import { ProfileType } from './global';

export interface GetProfileRequest {
  username: string;
  token?: string;
}

export interface GetProfileResponse {
  profile: ProfileType;
}

export interface FollowUserRequest {
  username: string;
  token: string;
}

export interface FollowUserResponse {
  profile: ProfileType;
}

export interface UnfollowUserRequest {
  username: string;
  token: string;
}
export type UnfollowUserResponse = void;
