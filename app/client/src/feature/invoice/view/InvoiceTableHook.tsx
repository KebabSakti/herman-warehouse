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
    const item = state.item;
    item.push(param);
    setState({ ...state, item, total: total(item) });
  }

  function removeItem(param: Item) {
    const item = state.item.filter((x) => x.id !== param.id);
    setState({ ...state, item, total: total(item) });
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
