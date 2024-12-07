import {
    Result as AntdResult,
    Button,
    Flex,
    Input,
    Modal,
    Pagination,
    Skeleton,
    Table,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Supplier } from "../../supplier/model/supplier_model";
import { useSupplierHook } from "../../supplier/view/supplier_hook";
import { PurchaseCreateProps } from "./PurchaseCreateOther";

export function AddSupplierModal(props: PurchaseCreateProps) {
  const active = props.modal == "supplier";
  const { auth, supplierController } = useContext(Dependency)!;
  const supplier = useSupplierHook(supplierController);
  const result = supplier.state.data as Result<Supplier[]> | null;
  const initParam = {
    page: "1",
    limit: "10",
  };
  const [param, setParam] = useState<any>(initParam);

  const makeSearch = debounce((message: string) => {
    const searchValue: any = {
      ...initParam,
      search: message,
    };

    if (message.length == 0) {
      delete searchValue.search;
    }

    setParam(searchValue);
  }, 500);

  useEffect(() => {
    if (active) {
      supplier.list(param, {
        token: auth.state.data!,
      });
    }
  }, [active, param]);

  return (
    <>
      <Modal
        centered
        destroyOnClose
        width={800}
        title="Daftar Supplier"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        {(() => {
          if (supplier.state.error != null) {
            return (
              <AntdResult
                status="error"
                title="Error"
                subTitle="Klik tombol di bawah untuk mengulang, atau coba beberapa saat lagi"
                extra={[
                  <Button
                    type="primary"
                    key="0"
                    onClick={() => {
                      setParam(initParam);
                    }}
                  >
                    Coba lagi
                  </Button>,
                ]}
              />
            );
          }

          if (result?.data != null) {
            return (
              <Flex vertical gap="small">
                <Input.Search
                  allowClear
                  placeholder="Nama supplier"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    makeSearch(e.target.value);
                  }}
                />
                {(() => {
                  const products = result.data;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        loading={supplier.state.status == "loading"}
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={
                          products.length == 0
                            ? []
                            : products.map((e, i) => {
                                return { ...e, key: i };
                              })
                        }
                        columns={[
                          {
                            title: "Supplier",
                            dataIndex: "name",
                            minWidth: 60,
                          },
                          {
                            title: "No. Hp",
                            dataIndex: "phone",
                            minWidth: 60,
                          },
                          {
                            render: (_, record) => {
                              return (
                                <Button
                                  type="primary"
                                  disabled={
                                    props.hook.state.supplier?.id == record.id
                                  }
                                  onClick={() => {
                                    props.hook.supplier({
                                      id: record.id!,
                                      name: record.name!,
                                    });

                                    props.setModal("");
                                  }}
                                >
                                  {props.hook.state.supplier?.id == record.id
                                    ? "Terpilih"
                                    : "Pilih"}
                                </Button>
                              );
                            },
                          },
                        ]}
                      />
                      <Pagination
                        simple
                        align="center"
                        showSizeChanger={false}
                        current={result?.paging!.page}
                        total={result?.paging!.total}
                        onChange={(page) => {
                          setParam({
                            ...param,
                            page: page.toString(),
                          });
                        }}
                      />
                    </Flex>
                  );
                })()}
              </Flex>
            );
          }

          return <Skeleton />;
        })()}
      </Modal>
    </>
  );
}
