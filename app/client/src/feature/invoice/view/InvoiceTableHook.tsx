import { useState } from "react";
import { Invoice as InvoiceID } from "../../../helper/invoice";
import { randomID } from "../../../helper/util";
import { Installment, Invoice, Item } from "../model/invoice_model";

export type InvoiceTableHookType = {
  state: Invoice;
  setState: (param: Invoice) => void;
  addItem: (param: Item) => void;
  removeItem: (param: Item) => void;
  addInstallment: (param: Installment) => void;
  removeInstallment: (param: Installment) => void;
};

export function useInvoiceTableHook(): InvoiceTableHookType {
  const [state, setState] = useState<Invoice>({
    id: randomID(),
    code: InvoiceID.customer(),
    customerId: "",
    customerName: "",
    customerPhone: "",
    total: 0,
    item: [],
  });

  function addItem(param: Item) {
    const items = state.item;
    const index = items.findIndex((x) => x.stockId === param.stockId);

    if (index == -1) {
      items.push(param);
    } else {
      items[index] = param;
    }

    setState({ ...state, item: items, total: total(items) });
  }

  function removeItem(param: Item) {
    const items = state.item;
    const index = items.findIndex((x) => x.stockId === param.stockId);

    if (index >= 0) {
      if (items[index].qty > 1) {
        items[index] = param;
      } else {
        items.splice(index, 1);
      }

      setState({ ...state, item: items, total: total(items) });
    }
  }

  function addInstallment(param: Installment) {
    const installment = state.installment ?? [];
    installment.push(param);
    setState({ ...state, installment, total: total(state.item, installment) });
  }

  function removeInstallment(param: Installment) {
    const installment = state.installment?.filter((x) => x.id !== param.id);
    setState({ ...state, installment, total: total(state.item, installment) });
  }

  function total(
    item: Item[],
    installment: Installment[] = state.installment ?? []
  ) {
    const itemTotal = item.reduce((a, b) => a + b.total, 0);
    const installmentTotal = installment.reduce((a, b) => a + b.amount, 0);
    const total = itemTotal - installmentTotal;

    return total;
  }

  return {
    state,
    setState,
    addItem,
    removeItem,
    addInstallment,
    removeInstallment,
  };
}
