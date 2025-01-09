import { Card, Flex } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadTitle } from "../../../component/HeadTitle";
import { AddLedgerModal } from "./AddLedgerModal";
import { AddPaymentModal } from "./AddPaymentModal";
import { AddProductModal } from "./AddProductModal";
import { AddSupplierModal } from "./AddSupplierModal";
import { PurchaseTable } from "./PurchaseTable";
import {
  PurchaseTableHookType,
  usePurchaseTableHook,
} from "./PurchaseTableHook";

export type PurchaseCreateProps = {
  hook: PurchaseTableHookType;
  modal: string;
  setModal: (value: string) => void;
};

export function PurchaseCreate() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  const purchaseTableHook = usePurchaseTableHook();

  return (
    <>
      <AddProductModal
        hook={purchaseTableHook}
        modal={modal}
        setModal={setModal}
      />
      <AddPaymentModal
        hook={purchaseTableHook}
        modal={modal}
        setModal={setModal}
      />
      <AddLedgerModal
        hook={purchaseTableHook}
        modal={modal}
        setModal={setModal}
      />
      <AddSupplierModal
        hook={purchaseTableHook}
        modal={modal}
        setModal={setModal}
      />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <HeadTitle
          title="Nota Baru"
          onClick={() => {
            navigate(-1);
          }}
        />
        <Card>
          <PurchaseTable
            hook={purchaseTableHook}
            modal={modal}
            setModal={setModal}
          />
        </Card>
      </Flex>
    </>
  );
}
