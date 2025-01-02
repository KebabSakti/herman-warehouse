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
import { Num } from "../../../helper/num";
import { Customer } from "../../customer/model/customer_model";
import { useCustomerHook } from "../../customer/view/CustomerHook";
import { InvoiceCreateProps } from "./InvoiceCreate";

export function AddCustomerModal(props: InvoiceCreateProps) {
  const active = props.modal == "customer";
  const { auth, customerController } = useContext(Dependency)!;
  const customer = useCustomerHook(customerController);
  const result = customer.state.data as Result<Customer[]> | null;
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
      customer.list(param, {
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
        title="Daftar Kustomer"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        {(() => {
          if (customer.state.error != null) {
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
                  placeholder="Nama / No. Hp"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    makeSearch(e.target.value);
                  }}
                />
                <Flex vertical gap="middle">
                  <Table
                    bordered
                    loading={customer.state.status == "loading"}
                    style={{ overflowX: "scroll" }}
                    pagination={false}
                    dataSource={
                      result.data.length == 0
                        ? []
                        : result.data.map((e, i) => {
                            return { ...e, key: i };
                          })
                    }
                    columns={[
                      {
                        title: "Kustomer",
                        dataIndex: "name",
                        minWidth: 60,
                      },
                      {
                        title: "No. Hp",
                        dataIndex: "phone",
                        minWidth: 60,
                      },
                      {
                        title: "Piutang",
                        dataIndex: "outstanding",
                        minWidth: 60,
                        render: (value) => <>{Num.format(value)}</>,
                      },
                      {
                        render: (_, record) => {
                          return (
                            <Button
                              type="primary"
                              disabled={
                                props.hook.state.customerId == record.id
                              }
                              onClick={() => {
                                props.hook.setState({
                                  ...props.hook.state,
                                  customerId: record.id,
                                  customerName: record.name,
                                  customerPhone: record.phone,
                                  customerAddress: record.address,
                                });

                                props.setModal("");
                              }}
                            >
                              {props.hook.state.customerId == record.id
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
              </Flex>
            );
          }

          return <Skeleton />;
        })()}
      </Modal>
    </>
  );
}
