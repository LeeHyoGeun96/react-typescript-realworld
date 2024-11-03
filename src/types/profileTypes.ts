export interface GetProfileRequest {
  username: string;
  token?: string;
}

export interface GetProfileResponse {
  profile: {
    username: string;
    bio: string;
    image: string | null;
    following: boolean;
    isCurrentUser: boolean;
  };
}
