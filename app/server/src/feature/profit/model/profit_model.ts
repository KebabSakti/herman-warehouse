export interface Profit {
  id: string;
  printed: string;
  total: number;
  profit: number;
}

export interface ProfitList {
  start: string;
  end: string;
}

export interface ProfitSummary {
  data: Profit[];
  total: number;
  profit: number;
  record: number;
}
