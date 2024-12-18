import { Card, Flex } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadTitle } from "../../../component/HeadTitle";
import { AddPaymentModal } from "./AddPaymentModal";
import { AddProductModal } from "./AddProductModal";
import { AddSupplierModal } from "./AddSupplierModal";
import { ReceiptTable } from "./ReceiptTable";
import { ReceiptTableHookType, useReceiptTableHook } from "./ReceiptTableHook";

export type PurchaseCreateProps = {
  hook: ReceiptTableHookType;
  modal: string;
  setModal: (value: string) => void;
};

export function PurchaseCreate() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  const receiptTableHook = useReceiptTableHook();

  return (
    <>
      <AddProductModal
        hook={receiptTableHook}
        modal={modal}
        setModal={setModal}
      />
      <AddPaymentModal
        hook={receiptTableHook}
        modal={modal}
        setModal={setModal}
      />
      <AddSupplierModal
        hook={receiptTableHook}
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
          <ReceiptTable
            hook={receiptTableHook}
            modal={modal}
            setModal={setModal}
          />
        </Card>
      </Flex>
    </>
  );
}
