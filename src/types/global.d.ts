interface User {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string | null;
  };
}

interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

type LoginResponse = User;

interface SignupFormDataType {
  username: string;
  email: string;
  password: string;
}
interface SignupRequest {
  user: SignupFormDataType;
}

type SignupResponse = User;

interface ErrorResponse {
  errors: {
    body: string[];
  };
}

interface ValidationErrors {
  [key: string]: string[];
}

interface UpdateUserRequest {
  user: {
    email?: string;
    password?: string;
    username?: string;
    bio?: string;
    image?: string;
  };
}

type UpdateUserResponse = User;
