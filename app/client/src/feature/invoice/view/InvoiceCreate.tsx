import { Card, Flex } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadTitle } from "../../../component/HeadTitle";
import { AddProductStockModal } from "./AddProductStockModal";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTableHookType, useInvoiceTableHook } from "./InvoiceTableHook";
import { AddCustomerModal } from "./AddCustomerModal";
import { AddPaymentModal } from "./AddPaymentModal";

export type InvoiceCreateProps = {
  hook: InvoiceTableHookType;
  modal: string;
  setModal: (value: string) => void;
};

export function InvoiceCreate() {
  const navigate = useNavigate();
  const invoiceHook = useInvoiceTableHook();
  const [modal, setModal] = useState("");

  return (
    <>
      <AddProductStockModal
        hook={invoiceHook}
        modal={modal}
        setModal={setModal}
      />
      <AddCustomerModal hook={invoiceHook} modal={modal} setModal={setModal} />
      <AddPaymentModal hook={invoiceHook} modal={modal} setModal={setModal} />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <HeadTitle
          title="Nota Baru"
          onClick={() => {
            navigate(-1);
          }}
        />
        <Card>
          <InvoiceTable hook={invoiceHook} modal={modal} setModal={setModal} />
        </Card>
      </Flex>
    </>
  );
}
