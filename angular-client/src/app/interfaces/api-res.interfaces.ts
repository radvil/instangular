export interface ApiResponse<T> {
  status: number;
  message?: string;
  total?: number;
  data?: T
}