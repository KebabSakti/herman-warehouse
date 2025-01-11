export interface Sale {
  id: string;
  name: string;
  phone?: string | null | undefined;
  nota: number;
  total: number;
}

export interface SaleList {
  start: string;
  end: string;
  search?: string | null | undefined;
}

export interface SaleSummary {
  data: Sale[];
  nota: number;
  total: number;
  record: number;
}
