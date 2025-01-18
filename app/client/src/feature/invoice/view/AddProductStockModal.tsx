import {
  Result as AntdResult,
  Button,
  Flex,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Skeleton,
  Table,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Stock } from "../../stock/model/stock_model";
import { useStockHook } from "../../stock/view/StockHook";
import { InvoiceCreateProps } from "./InvoiceCreate";
import { Num } from "../../../helper/num";
import { randomID } from "../../../helper/util";

export function AddProductStockModal(props: InvoiceCreateProps) {
  const active = props.modal == "product";
  const { auth, stockController } = useContext(Dependency)!;
  const stock = useStockHook(stockController);
  const result = stock.state.data as Result<Stock[]> | null;
  const initParam = {
    page: "1",
    limit: "10",
  };
  const [param, setParam] = useState<any>(initParam);

  const search = debounce((message: string) => {
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
      stock.list(param, {
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
        title="Tambah Produk"
        maskClosable={false}
        open={active}
        footer={null}
        onCancel={() => {
          props.setModal("");
        }}
      >
        {(() => {
          if (stock.state.error != null) {
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
                  placeholder="Kode/nama produk/nama supplier"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    search(e.target.value);
                  }}
                />
                <Flex vertical gap="middle">
                  <Table
                    bordered
                    size="small"
                    loading={stock.state.status == "loading"}
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
                        title: "Supplier",
                        dataIndex: ["supplier", "name"],
                        minWidth: 60,
                      },
                      {
                        title: "Kode",
                        dataIndex: ["product", "code"],
                        minWidth: 60,
                      },
                      {
                        title: "Product",
                        dataIndex: ["product", "name"],
                        minWidth: 60,
                      },
                      // {
                      //   title: "Stok",
                      //   dataIndex: "qty",
                      //   minWidth: 60,
                      // },
                      {
                        title: "Harga (Kg)",
                        dataIndex: "price",
                        minWidth: 60,
                        render: (value) => {
                          return Num.format(value);
                        },
                      },
                      {
                        render: (_, record) => {
                          const item = props.hook.state.item.find(
                            (a) => a.stockId == record.id
                          );

                          return (
                            <InputNumber
                              stringMode
                              min={0}
                              value={item?.qty ?? 0}
                              onChange={(value) => {
                                const qty = value ?? 0;
                                const total = qty * record.price;

                                props.hook.changeItem({
                                  id: randomID(),
                                  invoiceId: props.hook.state.id,
                                  stockId: record.id,
                                  productId: record.product.id,
                                  productCode: record.product.code,
                                  productName: record.product.name,
                                  productNote: record.product.note,
                                  supplierId: record.supplier.id,
                                  supplierName: record.supplier.name,
                                  supplierPhone: record.supplier.phone ?? "",
                                  price: record.price,
                                  qty: qty,
                                  total: total,
                                });
                              }}
                            />
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
