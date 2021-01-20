import { AuthState } from "../interfaces/auth-state.interface";

export const initialState: AuthState = {
  isLoading: false,
  isLoaded: false,
  user: null,
  error: null,
}
