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
  Tag,
} from "antd";
import Title from "antd/es/typography/Title";
import { useContext, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Dependency } from "../../../component/App";
import { debounce } from "../../../helper/debounce";
import { UserSummary } from "../model/user_type";
import { useUserHook } from "./UserHook";

export function UserList() {
  const { auth, userController } = useContext(Dependency)!;
  const user = useUserHook(userController);
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
      user.list(param, { token: auth.state.data! });
    }
  }, [search]);

  useEffect(() => {
    if (user.state.status == "complete" && user.state.error != null) {
      notification.error({
        message: "Error",
        description: user.state.error.message,
      });
    }

    if (
      user.state.action == "remove" &&
      user.state.status == "complete" &&
      user.state.error == null
    ) {
      user.list(param, { token: auth.state.data! });

      notification.success({
        message: "Sukses",
        description: "Data berhasil dihapus",
      });
    }
  }, [user.state]);

  return (
    <>
      <Outlet />
      <Flex vertical gap="small" style={{ padding: "16px" }}>
        <Title level={4}>Daftar User</Title>
        <Spin spinning={user.state.status == "loading"}>
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
                      navigate("/app/account/create", {
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
                        placeholder="Username / nama"
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
                if (user.state.data) {
                  const userData = user.state.data as UserSummary;

                  return (
                    <Flex vertical gap="middle">
                      <Table
                        bordered
                        style={{ overflowX: "scroll" }}
                        pagination={false}
                        dataSource={userData.data.map((e, i) => {
                          return { ...e, key: i };
                        })}
                        columns={[
                          {
                            title: "Username",
                            dataIndex: "uid",
                            minWidth: 60,
                          },
                          {
                            title: "Nama",
                            dataIndex: "name",
                            minWidth: 60,
                          },
                          // {
                          //   title: "Role",
                          //   dataIndex: "role",
                          //   minWidth: 60,
                          //   render: (value) => (
                          //     <>
                          //       <Tag>{value}</Tag>
                          //     </>
                          //   ),
                          // },
                          {
                            title: "Status",
                            dataIndex: "active",
                            minWidth: 60,
                            render: (value) => (
                              <>
                                {value ? (
                                  <Tag color="green">AKTIF</Tag>
                                ) : (
                                  <Tag color="red">NON AKTIF</Tag>
                                )}
                              </>
                            ),
                          },
                          {
                            dataIndex: "id",
                            render: (value) => (
                              <>
                                <Flex gap={4}>
                                  <Button
                                    icon={<EditFilled />}
                                    color="primary"
                                    size="small"
                                    variant="solid"
                                    onClick={() => {
                                      navigate(`/app/account/edit/${value}`, {
                                        state: {
                                          from:
                                            location.pathname + location.search,
                                        },
                                      });
                                    }}
                                  />
                                  {userData.data.length > 1 && (
                                    <Popconfirm
                                      placement="topLeft"
                                      title="Data akan dihapus"
                                      description="Proses ini tidak dapat dikembalikan, lanjutkan?"
                                      okText="Ya"
                                      cancelText="Batal"
                                      onConfirm={() => {
                                        user.remove(value, {
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
                                  )}
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
                        current={param.page}
                        total={userData.record}
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
