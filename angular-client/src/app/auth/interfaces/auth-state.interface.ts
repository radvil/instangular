import { User } from "src/app/user/interfaces";

export interface AuthState {
  user: User;
  isLoading: boolean;
  isLoaded: boolean;
  error?: Error | null;
}