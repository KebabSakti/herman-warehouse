import { useState } from "react";

export enum ReceiptTableTag {
  Inventory = "inventory",
  Payment = "payment",
}

type Total = {
  item: number;
  payment: number;
  margin: number;
  sum: number;
};

type ReceiptTableSupplier = {
  id: string;
  name: string;
};

type ReceiptTableItem = {
  key: string;
  id: string;
  name: string;
  tag: ReceiptTableTag;
  qty?: number | null | undefined;
  price?: number | null | undefined;
  total: number;
};

type ReceiptTableState = {
  created?: string | null | undefined;
  supplier?: ReceiptTableSupplier | null | undefined;
  note?: string | null | undefined;
  fee: number;
  // margin: number;
  total: Total;
  item: ReceiptTableItem[];
};

export type ReceiptTableHookType = {
  state: ReceiptTableState;
  supplier(param: ReceiptTableSupplier): void;
  created(value: string): void;
  note(value: string): void;
  fee(value: number): void;
  addItem(param: ReceiptTableItem): void;
  removeItem(param: ReceiptTableItem): void;
  modItem(param: ReceiptTableItem): void;
};

export function useReceiptTableHook(): ReceiptTableHookType {
  const [state, setState] = useState<ReceiptTableState>({
    fee: 0,
    total: {
      item: 0,
      payment: 0,
      margin: 0,
      sum: 0,
    },
    item: [],
  });

  function total(item: ReceiptTableItem[], fee: number): Total {
    const inventories = item.filter((a) => a.tag == ReceiptTableTag.Inventory);
    const payments = item.filter((a) => a.tag == ReceiptTableTag.Payment);
    const itemTotal = inventories.reduce((a, b) => a + b.total, 0);
    const paymentTotal = payments.reduce((a, b) => a + b.total, 0);
    const margin = itemTotal * (fee / 100);
    const total = itemTotal - margin - paymentTotal;

    const result = {
      item: itemTotal,
      payment: paymentTotal,
      margin: margin,
      sum: total,
    };

    return result;
  }

  function supplier(param: ReceiptTableSupplier): void {
    setState({ ...state, supplier: param });
  }

  function created(value: string): void {
    setState({ ...state, created: value });
  }

  function note(value: string): void {
    setState({ ...state, note: value });
  }

  function fee(value: number): void {
    const result = total(state.item, value);

    setState({ ...state, fee: value, total: result });
  }

  function addItem(param: ReceiptTableItem): void {
    const item = [...state.item];
    item.push(param);
    const result = total(item, state.fee);

    setState({ ...state, item: item, total: result });
  }

  function removeItem(param: ReceiptTableItem): void {
    const item = [...state.item];
    const index = item.findIndex((a) => a.key == param.key);

    // if (index == -1) {
    //   setState({
    //     ...state,
    //     item: [],
    //     total: {
    //       item: 0,
    //       payment: 0,
    //       margin: 0,
    //       sum: 0,
    //     },
    //   });
    // }

    if (index >= 0) {
      item.splice(index, 1);
      const result = total(item, state.fee);

      setState({
        ...state,
        item: item,
        total: result,
      });
    }
  }

  function modItem(param: ReceiptTableItem): void {
    const item = [...state.item];
    const index = item.findIndex((a) => a.key == param.key);

    if (index >= 0) {
      const itemTotal = param.qty! * param.price!;
      item[index] = { ...param, total: itemTotal };
      const result = total(item, state.fee);

      setState({ ...state, item: item, total: result });
    }
  }

  return {
    state,
    supplier,
    note,
    fee,
    created,
    addItem,
    removeItem,
    modItem,
  };
}