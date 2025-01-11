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
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Result } from "../../../common/type";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { Customer } from "../model/customer_model";
import { useCustomerHook } from "./CustomerHook";
import { Num } from "../../../helper/num";

export function CustomerList() {
  const { auth, customerController } = useContext(Dependency)!;
  const customer = useCustomerHook(customerController);
  const result = customer.state.data as Result<Customer[]> | null;
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
      customer.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (customer.state.status == "complete" && customer.state.error != null) {
      notification.error({
        message: "Error",
        description: customer.state.error.message,
      });
    }

    if (
      customer.state.action == "remove" &&
      customer.state.status == "complete" &&
      customer.state.error == null
    ) {
      customer.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Data berhasil dihapus",
      });
    }
  }, [customer.state]);

  return (
    <>
      <Outlet />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Daftar customer</Title>
        <Spin spinning={customer.state.status == "loading"}>
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
                      navigate("/app/customer/create", {
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
                        placeholder="Nama / telp"
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
                            title: "customer",
                            dataIndex: "name",
                            minWidth: 60,
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
                            title: "Piutang",
                            dataIndex: "outstanding",
                            minWidth: 60,
                            render: (value) => Num.format(value),
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
                                      navigate(`/app/customer/edit/${e.id}`, {
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
                                      customer.remove(e.id, {
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
