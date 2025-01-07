import { Installment } from "./installment_model";
import { Item } from "./item_model";

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null | undefined;
  code: string;
  note?: string | null | undefined;
  total: number;
  item?: Item[] | null | undefined;
  installment?: Installment[] | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
