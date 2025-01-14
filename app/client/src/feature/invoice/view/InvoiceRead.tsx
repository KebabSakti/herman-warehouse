import { Modal, Skeleton, Tabs } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Dependency } from "../../../component/App";
import { Invoice } from "../model/invoice_model";
import { InstallmentDetailTab } from "./InstallmentDetailTab";
import { InvoiceDetailTab } from "./InvoiceDetailTab";
import { useInvoiceHook } from "./InvoiceHook";

export function InvoiceRead() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("1");
  const { auth, invoiceController } = useContext(Dependency)!;
  const invoice = useInvoiceHook(invoiceController);
  const { invoiceId } = useParams();

  useEffect(() => {
    if (
      invoiceId &&
      invoice.state.action == "idle" &&
      invoice.state.status == "idle"
    ) {
      invoice.read(invoiceId, { token: auth.state.data! });
    }
  }, [invoice.state]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={800}
        maskClosable={false}
        open={location.pathname.includes("/app/order/read")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/order?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (invoice.state.data) {
            const data = invoice.state.data as Invoice;

            return (
              <>
                <Tabs
                  activeKey={activeTab}
                  onTabClick={(key) => {
                    setActiveTab(key);
                  }}
                  items={[
                    {
                      key: "1",
                      label: "Detail Nota",
                      children: <InvoiceDetailTab invoice={data} />,
                    },
                    {
                      key: "2",
                      label: "Riwayat Setoran",
                      children: <InstallmentDetailTab invoiceHook={invoice} />,
                    },
                  ]}
                />
              </>
            );
          }

          return (
            <>
              <Skeleton />
            </>
          );
        })()}
      </Modal>
    </>
  );
}
