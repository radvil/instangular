import { AuthState } from "../interfaces/auth-state.interface";

export const initialState: AuthState = {
  isLoading: false,
  isAuth: false,
  accessToken: null,
  user: null,
  error: null,
}
