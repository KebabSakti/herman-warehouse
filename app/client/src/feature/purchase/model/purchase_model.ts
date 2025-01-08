import { Inventory } from "../../inventory/model/inventory_model";
import { Ledger } from "../../ledger/model/ledger_model";
import { Payment } from "../../payment/model/payment_model";

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  supplierAddress?: string | null | undefined;
  supplierNote?: string | null | undefined;
  code?: string | null | undefined;
  fee: number;
  margin: number;
  totalItem: number;
  dp: number;
  other: number;
  outstanding: number;
  total: number;
  paid: number | null | undefined;
  balance: number;
  note?: string | null | undefined;
  due?: string | null | undefined;
  printed?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
  inventory: Inventory[];
  payment?: Payment[] | null | undefined;
  ledger?: Ledger[] | null | undefined;
}
