export interface Supplier {
  id: string;
  name: string;
  phone?: string | null | undefined;
  address?: string | null | undefined;
  note?: string | null | undefined;
  outstanding: number;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
