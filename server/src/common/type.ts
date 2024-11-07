export type Result<T> = {
  data: T;
  paging: {
    page: number;
    limit: number;
    total: number;
  };
};
