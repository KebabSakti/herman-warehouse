import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Row,
  Skeleton,
  Table,
  Result as AntdResult,
} from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Product } from "../model/product_type";
import { useProductHook } from "./ProductHook";

export function ProductList() {
  const { auth, productController } = useContext(Dependency)!;
  const product = useProductHook(productController);
  const result = product.state.data as Result<Product[]> | null;
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const initParam = {
    page: "1",
    limit: "10",
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());

  const productSearch = debounce((message: string) => {
    const searchValue = {
      ...param,
      ...initParam,
      search: message,
    };

    if (message.length == 0) {
      delete searchValue.search;
    }

    setSearch(searchValue);
  }, 500);

  useEffect(() => {
    setSearch(param);
  }, []);

  useEffect(() => {
    if (search.size >= 2) {
      product.list(param, {
        token: auth.state.data!,
      });
    }
  }, [search]);

  useEffect(() => {
    if (product.state.status == "complete" && product.state.error != null) {
      notification.error({
        message: "Error",
        description: product.state.error.message,
      });
    }

    if (
      product.state.action == "remove" &&
      product.state.status == "complete" &&
      product.state.error == null
    ) {
      product.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Produk berhasil dihapus",
      });
    }
  }, [product.state]);

  return (
    <Flex vertical gap="small" style={{ padding: "16px" }}>
      <Title level={4}>Product List</Title>
      <Card>
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
                      setSearch(initParam);
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
                <Row gutter={[0, 6]} justify={{ xl: "space-between" }}>
                  <Col xs={24} md={6} xl={4}>
                    <Button
                      block
                      color="primary"
                      variant="solid"
                      size="large"
                      onClick={() => {
                        navigate("/app/product/create", {
                          state: { from: location.pathname + location.search },
                        });
                      }}
                    >
                      Tambah Produk
                    </Button>
                  </Col>
                  <Col xs={24} md={10} xl={8}>
                    <Input.Search
                      allowClear
                      placeholder="Kode / nama produk"
                      size="large"
                      defaultValue={param.search}
                      onChange={(e) => {
                        productSearch(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
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
                            render: (_, e) => (
                              <>
                                <Flex gap={4}>
                                  <Button
                                    icon={<EditFilled />}
                                    color="primary"
                                    size="small"
                                    variant="solid"
                                    onClick={() => {
                                      navigate(`/app/product/edit/${e.id}`, {
                                        state: {
                                          from:
                                            location.pathname + location.search,
                                        },
                                      });
                                    }}
                                  />
                                  <Popconfirm
                                    placement="topLeft"
                                    title="Data akan dihapus"
                                    description="Proses ini tidak dapat dikembalikan, lanjutkan?"
                                    okText="Ya"
                                    cancelText="Batal"
                                    onConfirm={() => {
                                      product.remove(e.id, {
                                        token: auth.state.data!,
                                      });
                                    }}
                                  >
                                    <Button
                                      icon={<DeleteFilled />}
                                      color="danger"
                                      size="small"
                                      variant="solid"
                                    />
                                  </Popconfirm>
                                </Flex>
                              </>
                            ),
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
                          setSearch({
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
      </Card>
    </Flex>
  );
}
