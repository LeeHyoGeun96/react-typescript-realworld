export interface User {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string | null;
  };
}

export interface LoginRequestParams {
  user: {
    email: string;
    password: string;
  };
}

export type LoginDTO = LoginRequestParams;

export type LoginResponse = User;

export interface SignupFormDataType {
  username: string;
  email: string;
  password: string;
}
export type SignupDTO = SignupFormDataType;

export type SignupRequestParams = SignupFormDataType;

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
