import { Card, Flex } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadTitle } from "../../../component/HeadTitle";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTableHookType, useInvoiceTableHook } from "./InvoiceTableHook";

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
