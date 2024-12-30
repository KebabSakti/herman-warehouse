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
import { randomID } from "../../../helper/util";
import { Product } from "../../product/model/product_type";
import { useProductHook } from "../../product/view/ProductHook";
import { InvoiceCreateProps } from "./InvoiceCreate";

export function AddProductModal(props: InvoiceCreateProps) {
  const active = props.modal == "product";
  const { auth, productController } = useContext(Dependency)!;
  const product = useProductHook(productController);
  const result = product.state.data as Result<Product[]> | null;
  const initParam = {
    page: "1",
    limit: "10",
  };
  const [param, setParam] = useState<any>(initParam);

  const productSearch = debounce((message: string) => {
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
      product.list(param, {
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
          if (product.state.error != null) {
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
                  placeholder="Kode / nama produk"
                  size="large"
                  defaultValue={param.search}
                  onChange={(e) => {
                    productSearch(e.target.value);
                  }}
                />
                {(() => {
                  const products = result.data;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        loading={product.state.status == "loading"}
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
                            title: "Kode",
                            dataIndex: "code",
                            minWidth: 60,
                          },
                          {
                            title: "Product",
                            dataIndex: "name",
                            minWidth: 60,
                          },
                          {
                            render: (_, record) => {
                              const item = props.hook.state.item.filter(
                                (a) => a.id == record.id
                              );

                              return (
                                <InputNumber
                                  min={0}
                                  value={item.length}
                                  onStep={(_, info) => {
                                    if (info.type == "down") {
                                      const index = item.length - 1;
                                      props.hook.removeItem(item[index]);
                                    }

                                    if (info.type == "up") {
                                      // props.hook.addItem({
                                      //   id: randomID(),
                                      //   productId: record.id,
                                      // });
                                    }
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
