export interface Outstanding {
  id: string;
  name: string;
  phone?: string | null | undefined;
  nota: number;
  total: number;
  paid: number;
  unpaid: number;
}

export interface OutstandingList {
  start: string;
  end: string;
  search?: string | null | undefined;
}

export interface OutstandingSummary {
  data: Outstanding[];
  nota: number;
  total: number;
  paid: number;
  unpaid: number;
  record: number;
}
