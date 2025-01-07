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
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Supplier } from "../model/supplier_model";
import { useSupplierHook } from "./SupplierHook";

export function SupplierList() {
  const { auth, supplierController } = useContext(Dependency)!;
  const supplier = useSupplierHook(supplierController);
  const result = supplier.state.data as Result<Supplier[]> | null;
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const initParam = {
    page: "1",
    limit: "10",
  };
  const param: any =
    search.size == 0 ? initParam : Object.fromEntries(search.entries());
  const searchRecord = debounce((message: string) => {
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
      supplier.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (supplier.state.status == "complete" && supplier.state.error != null) {
      notification.error({
        message: "Error",
        description: supplier.state.error.message,
      });
    }

    if (
      supplier.state.action == "remove" &&
      supplier.state.status == "complete" &&
      supplier.state.error == null
    ) {
      supplier.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Data berhasil dihapus",
      });
    }
  }, [supplier.state]);

  return (
    <>
      <Outlet />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Daftar Supplier</Title>
        <Spin spinning={supplier.state.status == "loading"}>
          <Card>
            <Flex vertical gap="small">
              <Row gutter={[4, 4]} justify={{ xl: "space-between" }}>
                <Col xs={{ flex: "100%" }} md={{ flex: "20%" }}>
                  <Button
                    block
                    color="primary"
                    variant="solid"
                    size="large"
                    onClick={() => {
                      navigate("/app/supplier/create", {
                        state: {
                          from: location.pathname + location.search,
                        },
                      });
                    }}
                  >
                    Tambah Data
                  </Button>
                </Col>
                <Col xs={{ flex: "100%" }} md={{ flex: "80%" }}>
                  <Row gutter={[4, 4]} justify="end">
                    <Col>
                      <Input.Search
                        allowClear
                        placeholder="Nama/telp"
                        size="large"
                        defaultValue={param.search}
                        onChange={(e) => {
                          searchRecord(e.target.value);
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {(() => {
                if (result?.data != null) {
                  const datas = result.data;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={
                          datas.length == 0
                            ? []
                            : datas.map((e, i) => {
                                return { ...e, key: i };
                              })
                        }
                        columns={[
                          {
                            title: "Supplier",
                            dataIndex: "name",
                            minWidth: 60,
                            render: (_, record) => (
                              <>
                                <Link
                                  to={`/app/supplier/read/${record.id}`}
                                  state={{
                                    from: location.pathname + location.search,
                                  }}
                                >
                                  {record.name}
                                </Link>
                              </>
                            ),
                          },
                          {
                            title: "No Hp",
                            dataIndex: "phone",
                            minWidth: 60,
                          },
                          {
                            title: "Alamat",
                            dataIndex: "address",
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
                                      navigate(`/app/supplier/edit/${e.id}`, {
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
                                      supplier.remove(e.id, {
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
                }

                return <Table bordered pagination={false} dataSource={[]} />;
              })()}
            </Flex>
          </Card>
        </Spin>
      </Flex>
    </>
  );
}
