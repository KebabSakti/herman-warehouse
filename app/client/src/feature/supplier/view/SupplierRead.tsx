import { Button, Card, Flex, Result, Skeleton } from "antd";
import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { HeadTitle } from "../../../component/HeadTitle";
import { Num } from "../../../helper/num";
import { Supplier } from "../model/supplier_model";
import { useSupplierHook } from "./SupplierHook";
import { SupplierPurchaseList } from "./SupplierPurchaseList";

export type SupplierReadProps = {
  modal: string | null | undefined;
  setModal: (value?: string | null | undefined) => void;
};

export function SupplierRead() {
  const { auth, supplierController } = useContext(Dependency)!;
  const param = useParams();
  const supplier = useSupplierHook(supplierController);
  const navigate = useNavigate();
  const location = useLocation();

  function back() {
    const target =
      location.state?.from == null
        ? "/app/supplier?page=1&limit=10&search="
        : location.state.from;

    navigate(target);
  }

  useEffect(() => {
    if (supplier.state.action == "idle" && supplier.state.status == "idle") {
      supplier.read(param.id!, { token: auth.state.data! });
    }
  }, [supplier.state]);

  return (
    <>
      <Outlet />
      {(() => {
        if (supplier.state.error != null) {
          return (
            <>
              <Flex vertical gap="small" style={{ padding: "16px" }}>
                <HeadTitle title="Detail Hutang" onClick={back} />
                <Card>
                  <Result
                    status="error"
                    title="Error"
                    subTitle="Klik tombol di bawah untuk mengulang, atau coba beberapa saat lagi"
                    extra={[
                      <Button
                        type="primary"
                        key="0"
                        onClick={() => {
                          //
                        }}
                      >
                        Coba lagi
                      </Button>,
                    ]}
                  />
                </Card>
              </Flex>
            </>
          );
        }

        if (supplier.state.data != null) {
          const data = supplier.state.data as Supplier;

          return (
            <>
              <Flex vertical gap="small" style={{ padding: "16px" }}>
                <Flex justify="space-between">
                  <HeadTitle
                    title={`${data.name} | Rp ${Num.format(data.outstanding)}`}
                    onClick={back}
                  />
                </Flex>
                <Card>
                  <SupplierPurchaseList supplier={data} />
                </Card>
              </Flex>
            </>
          );
        }

        return (
          <>
            <Flex vertical gap="small" style={{ padding: "16px" }}>
              <HeadTitle title="Detail Hutang" onClick={back} />
              <Card>
                <Skeleton />
              </Card>
            </Flex>
          </>
        );
      })()}
    </>
  );
}
