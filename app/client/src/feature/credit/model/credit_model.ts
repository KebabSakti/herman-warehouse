export interface Credit {
  id: string;
  name: string;
  phone?: string | null | undefined;
  nota: number;
  total: number;
  paid: number;
  unpaid: number;
}

export interface CreditList {
  start: string;
  end: string;
  search?: string | null | undefined;
}

export interface CreditSummary {
  data: Credit[];
  nota: number;
  total: number;
  paid: number;
  unpaid: number;
  record: number;
}
