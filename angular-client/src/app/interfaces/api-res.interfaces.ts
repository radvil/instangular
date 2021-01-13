export interface ApiRes<T> {
  status: number;
  message?: string;
  total?: number;
  data?: T
}