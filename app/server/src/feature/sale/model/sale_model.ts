export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  nota: number;
  total: number;
  printed?: string | null | undefined;
}
