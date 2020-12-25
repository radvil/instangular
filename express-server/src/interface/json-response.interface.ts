export interface JsonHttpResponse<T> {
  status: number;
  message?: string;
  total?: number;
  data?: T;
}