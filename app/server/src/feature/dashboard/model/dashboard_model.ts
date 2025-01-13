export interface Dashboard {
  statistic: Statistic;
  monthly: MonthlySum[];
}

export interface Statistic {
  id: string;
  profit: number;
  supplier: number;
  customer: number;
}

export interface MonthlySum {
  id: string;
  total: number;
}

export interface DashboardRead {
  start: string;
  end: string;
}
