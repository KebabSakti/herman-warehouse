import { useState } from "react";
import { Invoice } from "../../../helper/invoice";
import { randomID } from "../../../helper/util";
import { Inventory } from "../../inventory/model/inventory_model";
import { Ledger } from "../../ledger/model/ledger_model";
import { Payment } from "../../payment/model/payment_model";
import { Supplier } from "../../supplier/model/supplier_model";
import { Purchase } from "../model/purchase_model";

type Total = {
  totalItem: number;
  other: number;
  margin: number;
  dp: number;
  total: number;
  balance: number;
};

export type PurchaseTableHookType = {
  state: Purchase;
  setState: (param: Purchase) => void;
  setValue: (param: Inventory) => void;
  setSupplier: (param: Supplier) => void;
  setDate: (param: string) => void;
  setFee: (param: number) => void;
  setInventory: (param: Inventory) => void;
  setLedger: (param: Ledger) => void;
  setPayment: (param: Payment) => void;
};

export function usePurchaseTableHook(): PurchaseTableHookType {
  const [state, setState] = useState<Purchase>({
    id: randomID(),
    code: Invoice.supplier(),
    supplierId: "",
    supplierName: "",
    supplierPhone: "",
    printed: "",
    fee: 0,
    margin: 0,
    totalItem: 0,
    outstanding: 0,
    total: 0,
    balance: 0,
    inventory: [],
  });

  console.log(state);

  function calculateTotal(
    inventory: Inventory[],
    outstanding: number,
    fee: number,
    payment: Payment[] | null | undefined,
    ledger: Ledger[] | null | undefined
  ): Total {
    const totalItem = inventory.reduce((a, b) => a + b.total, 0);
    const totalPayment = payment?.reduce((a, b) => a + b.amount, 0) ?? 0;
    const totalLedger = ledger?.reduce((a, b) => a + b.amount, 0) ?? 0;
    const margin = totalItem * (fee / 100);
    const total = totalItem - margin - totalPayment - totalLedger + outstanding;

    return {
      totalItem: totalItem,
      margin: margin,
      other: totalPayment,
      dp: totalLedger,
      balance: total,
      total: total,
    };
  }

  function setValue(param: Inventory) {
    const inventory = state.inventory;
    const index = inventory.findIndex((e) => e.id == param.id);

    if (index >= 0) {
      inventory[index] = { ...param, total: param.qty * param.price };
      const total = calculateTotal(
        inventory,
        state.outstanding ?? 0,
        state.fee,
        state.payment,
        state.ledger
      );

      setState({ ...state, ...total, inventory: inventory });
    }
  }

  function setSupplier(param: Supplier) {
    // const ledger = state.ledger ?? [];

    // if (ledger.length > 0) {
    //   ledger[0] = { ...ledger[0], supplierId: param.id };
    // }

    // const total = calculateTotal(
    //   state.inventory,
    //   param.outstanding,
    //   state.fee,
    //   state.payment,
    //   state.ledger
    // );

    setState({
      ...state,
      // ...total,
      supplierId: param.id,
      supplierName: param.name,
      supplierPhone: param.phone,
      supplierAddress: param.address,
      supplierNote: param.note,
      outstanding: param.outstanding,
    });
  }

  function setDate(param: string) {
    // const ledger = state.ledger ?? [];

    // if (ledger.length > 0) {
    //   ledger[0] = { ...ledger[0], printed: param };
    // }

    setState({
      ...state,
      printed: param,
    });
  }

  function setFee(param: number) {
    const total = calculateTotal(
      state.inventory,
      state.outstanding ?? 0,
      param,
      state.payment,
      state.ledger
    );

    setState({
      ...state,
      ...total,
      fee: param,
    });
  }

  function setInventory(param: Inventory) {
    const inventory = state.inventory;
    let payment = state.payment ?? [];
    const index = inventory.findIndex((e) => e.productId == param.productId);

    if (param.qty > 0) {
      inventory?.push(param);
    }

    if (param.qty <= 0 && index >= 0) {
      inventory.splice(index, 1);

      if (inventory.length == 0) {
        payment = [];
      }
    }

    const total = calculateTotal(
      inventory,
      state.outstanding ?? 0,
      state.fee,
      payment,
      state.ledger
    );

    setState({ ...state, ...total, inventory: inventory, payment: payment });
  }

  function setPayment(param: Payment) {
    const payment = state.payment ?? [];
    const index = payment.findIndex((e) => e.id == param.id);

    if (param.amount > 0) {
      payment.push(param);
    }

    if (param.amount <= 0 && index >= 0) {
      payment.splice(index, 1);
    }

    const total = calculateTotal(
      state.inventory,
      state.outstanding ?? 0,
      state.fee,
      payment,
      state.ledger
    );

    setState({ ...state, ...total, payment: payment });
  }

  function setLedger(param: Ledger) {
    const ledger = state.ledger ?? [];
    const index = ledger.findIndex((e) => e.id == param.id);

    if (param.amount > 0) {
      ledger.push(param);
    }

    if (param.amount <= 0 && index >= 0) {
      ledger.splice(index, 1);
    }

    const total = calculateTotal(
      state.inventory,
      state.outstanding ?? 0,
      state.fee,
      state.payment,
      ledger
    );

    setState({ ...state, ...total, ledger: ledger });
  }

  return {
    state,
    setState,
    setValue,
    setSupplier,
    setDate,
    setFee,
    setInventory,
    setPayment,
    setLedger,
  };
}
