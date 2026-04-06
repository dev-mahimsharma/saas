export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
