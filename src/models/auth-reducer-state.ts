export interface AuthReducerState {
  email: string;
  loggedIn: boolean;
  token: string | null;
}
