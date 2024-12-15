export type Paging = {
  page: number;
  limit: number;
};

export type Result<T> = {
  data: T;
  paging: {
    page: number;
    limit: number;
    total: number;
  };
};
