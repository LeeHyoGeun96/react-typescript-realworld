interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
}

interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

interface LoginResponse {
  user: User;
}

interface SignupFormDataType {
  username: string;
  email: string;
  password: string;
}
interface SignupRequest {
  user: SignupFormDataType;
}

interface SignupResponse {
  user: User;
}

interface ErrorResponse {
  errors: {
    body: string[];
  };
}

interface ValidationErrors {
  [key: string]: string[];
}
