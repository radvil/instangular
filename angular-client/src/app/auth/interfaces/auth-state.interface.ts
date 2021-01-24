import { User } from "src/app/user/interfaces";

export interface AuthState {
  user: User;
  isAuth: boolean;
  accessToken?: string;
  isLoading: boolean;
  error?: Error | null;
}