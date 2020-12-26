export interface JsonHttpResponse<T> {
  status: number;
  message?: string;
  data?: T;
}