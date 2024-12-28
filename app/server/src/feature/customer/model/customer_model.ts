export interface Customer {
  id: string;
  name: string;
  phone?: string | null | undefined;
  address?: string | null | undefined;
  outstanding?: number | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
