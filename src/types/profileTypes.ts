import { ProfileType } from './global';

export interface GetProfileRequestParams {
  username: string;
  token?: string;
}

export interface GetProfileResponse {
  profile: ProfileType;
}

export interface FollowUserRequestParams {
  username: string;
  token: string;
}

export interface FollowUserResponse {
  profile: ProfileType;
}

export interface UnfollowUserRequestParams {
  username: string;
  token: string;
}
export type UnfollowUserResponse = void;
