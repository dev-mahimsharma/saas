export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | { id: number; username: string };
}
