import { Modal, Skeleton, Tabs } from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Dependency } from "../../../component/App";
import { Purchase } from "../../purchase/model/purchase_model";
import { LedgerDetailTab } from "../../purchase/view/LedgerDetailTab";
import { PurchaseDetailTab } from "../../purchase/view/PurchaseDetailTab";
import { usePurchaseHook } from "../../purchase/view/PurchaseHook";

export type PurchaseTabProps = { purchase: Purchase };

export function PurchaseListModal() {
  const { auth, purchaseController } = useContext(Dependency)!;
  const purchase = usePurchaseHook(purchaseController);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const [activeTab, setActiveTab] = useState<string>("1");

  useEffect(() => {
    if (purchase.state.action == "idle" && purchase.state.status == "idle") {
      purchase.read(param.purchaseId!, { token: auth.state.data! });
    }
  }, [purchase.state]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={750}
        maskClosable={false}
        open={location.pathname.includes(
          `/app/supplier/read/${param.id}/inventory/read/${param.purchaseId}`
        )}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/supplier/read/${param.id}?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (purchase.state.data) {
            const purchaseData = purchase.state.data as Purchase;

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
                      children: <PurchaseDetailTab purchase={purchaseData} />,
                    },
                    {
                      key: "2",
                      label: "Riwayat Pembayaran",
                      children: <LedgerDetailTab purchaseHook={purchase} />,
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
