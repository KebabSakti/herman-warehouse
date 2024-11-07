export interface State<T> {
  status: string;
  action: string;
  data?: T | null;
  error?: Error;
}

export type Result<T> = {
  data: T;
  paging?: {
    page: number;
    limit: number;
    total: number;
  } | null;
};
