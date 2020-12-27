import { User } from "../../user";

export interface AuthState {
  user: User;
  isAuth: boolean;
  accessToken?: string;
  isLoading: boolean;
  error?: Error | null;
}

export class LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}