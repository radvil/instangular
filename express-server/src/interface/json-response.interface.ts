export interface JsonHttpResponse<T> {
  status: number;
  message?: string;
  page?: number;
  total?: number;
  data?: T;
}