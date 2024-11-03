export interface State<T> {
  status: string;
  action: string;
  data?: T | Array<T> | null;
  error?: Error;
}
