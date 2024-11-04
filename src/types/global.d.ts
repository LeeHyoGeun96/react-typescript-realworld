export interface ErrorResponse {
  errors: {
    body: string[];
  };
}

interface ProfileType {
  username: string;
  bio: string;
  image: string | null;
  following: boolean;
  isCurrentUser: boolean;
}
