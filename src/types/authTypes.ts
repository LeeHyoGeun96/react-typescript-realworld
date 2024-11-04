export interface User {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string | null;
  };
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export type LoginResponse = User;

export interface SignupFormDataType {
  username: string;
  email: string;
  password: string;
}
export interface SignupRequest {
  user: SignupFormDataType;
}

export type SignupResponse = User;

export interface ValidationErrors {
  [key: string]: string[];
}

export interface UpdateUserRequest {
  user: {
    email?: string;
    password?: string;
    username?: string;
    bio?: string;
    image?: string;
  };
}

export type UpdateUserResponse = User;
