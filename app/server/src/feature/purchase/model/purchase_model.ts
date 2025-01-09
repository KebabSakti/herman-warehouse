import { Inventory } from "../../inventory/model/inventory_model";
import { Ledger } from "../../ledger/model/ledger_model";
import { Payment } from "../../payment/model/payment_model";

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string | null | undefined;
  supplierAddress?: string | null | undefined;
  supplierNote?: string | null | undefined;
  code: string;
  fee: number;
  margin: number;
  totalItem: number;
  total: number;
  balance: number;
  dp?: number | null | undefined;
  other?: number | null | undefined;
  outstanding?: number | null | undefined;
  paid?: number | null | undefined;
  note?: string | null | undefined;
  due?: string | null | undefined;
  printed: string;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
  inventory: Inventory[];
  payment?: Payment[] | null | undefined;
  ledger?: Ledger[] | null | undefined;
}
