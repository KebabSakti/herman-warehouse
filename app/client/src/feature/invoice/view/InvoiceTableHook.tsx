import { useEffect, useState } from "react";
import { Invoice as InvoiceID } from "../../../helper/invoice";
import { randomID } from "../../../helper/util";
import { Installment, Invoice, Item } from "../model/invoice_model";

export type InvoiceTableHookType = {
  state: Invoice;
  setState: (param: Invoice) => void;
  changeItem: (param: Item) => void;
  changeInstallment: (param?: Installment | null | undefined) => void;
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

  useEffect(() => {
    console.log(state);
  }, [state]);

  function changeItem(param: Item) {
    const items = state.item;
    const index = items.findIndex((x) => x.stockId === param.stockId);

    if (param.qty == 0 && index >= 0) {
      items.splice(index, 1);
    }

    if (param.qty > 0 && index >= 0) {
      items[index] = param;
    }

    if (param.qty > 0 && index == -1) {
      items.push(param);
    }

    setState({ ...state, item: items, total: total(items) });
  }

  function changeInstallment(param?: Installment | null | undefined) {
    let installment: Installment[] | null | undefined;

    if (param != undefined) {
      installment = [];
      installment.push(param);
    } else {
      installment = null;
    }

    setState({
      ...state,
      installment: installment,
      total: total(state.item, installment ?? []),
    });
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
    changeItem,
    changeInstallment,
  };
}
