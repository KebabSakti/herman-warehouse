import { useState } from "react";
import { Invoice as InvoiceID } from "../../../helper/invoice";
import { randomID } from "../../../helper/util";
import { Installment } from "../../installment/model/installment_model";
import { Invoice } from "../model/invoice_model";
import { Item } from "../model/item_model";

type Total = {
  totalItem: number;
  totalPaid: number;
  total: number;
  outstanding: number;
};

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
    totalItem: 0,
    totalPaid: 0,
    total: 0,
    outstanding: 0,
    item: [],
  });

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

    const installment = items.length == 0 ? null : state.installment;
    const totals = total(items);

    setState({
      ...state,
      ...totals,
      item: items,
      installment: installment,
    });
  }

  function changeInstallment(param?: Installment | null | undefined) {
    let installment: Installment[] | null | undefined;

    if (param != undefined) {
      installment = [];
      installment.push(param);
    } else {
      installment = null;
    }

    const totals = total(state.item, installment ?? []);

    setState({
      ...state,
      ...totals,
      installment: installment,
    });
  }

  function total(
    item: Item[],
    installment: Installment[] = state.installment ?? []
  ): Total {
    const totalItem = item.reduce((a, b) => a + b.total, 0);
    const totalPaid = installment.reduce((a, b) => a + b.amount, 0);
    const total = totalItem - totalPaid;

    const result = {
      totalItem: totalItem,
      totalPaid: totalPaid,
      total: total,
      outstanding: total,
    };

    return result;
  }

  return {
    state,
    setState,
    changeItem,
    changeInstallment,
  };
}
