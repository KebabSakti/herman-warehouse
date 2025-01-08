import { Installment } from "../../installment/model/installment_model";
import { Item } from "./item_model";

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string | null | undefined;
  customerAddress?: string | null | undefined;
  code: string;
  note?: string | null | undefined;
  total: number;
  item: Item[];
  installment?: Installment[] | null | undefined;
  printed?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
