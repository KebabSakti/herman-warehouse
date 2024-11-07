export interface PurchaseModel {
  id?: string | null;
  userId?: string | null;
  userName?: string | null;
  userPhone?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierPhone?: string | null;
  supplierAddress?: string | null;
  supplierNote?: string | null;
  code?: string | null;
  fee?: number | null;
  total?: number | null;
  paid?: number | null;
  balance?: number | null;
  note?: string | null;
  due?: Date | null;
  printed?: Date | null;
  created?: Date | null;
  updated?: Date | null;
  deleted?: Date | null;
}