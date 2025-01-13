import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Spin,
  Typography,
} from "antd";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { randomID } from "../../../helper/util";
import { userCreateSchema } from "../model/user_type";
import { useUserHook } from "./UserHook";

export function UserCreate() {
  const { auth, userController } = useContext(Dependency)!;
  const user = useUserHook(userController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (user.state.action == "create" && user.state.status == "complete") {
      if (user.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil ditambahkan",
        });

        const target =
          location.state?.from == null
            ? "/app/account?page=1&limit=10"
            : location.state.from;

        navigate(target);
      } else {
        notification.error({
          message: "Error",
          description: user.state.error.message,
        });
      }
    }
  }, [user.state]);

  return (
    <>
      <Modal
        centered
        title="Tambah Data"
        maskClosable={false}
        open={location.pathname.includes("/app/account/create")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/account?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        <Spin spinning={user.state.status == "loading"}>
          <Form
            size="large"
            form={form}
            style={{ paddingTop: "14px" }}
            onFinish={async (values) => {
              const payload = {
                ...values,
                id: randomID(),
              };

              await userCreateSchema
                .validate(payload)
                .then(() => {
                  user.create(payload, {
                    token: auth.state.data!,
                  });
                })
                .catch((e) => {
                  notification.error({
                    message: "Error",
                    description: (
                      <Flex vertical gap={1}>
                        {e.errors.map((e: any, i: any) => {
                          return (
                            <Text key={i} type="danger">
                              {e}
                            </Text>
                          );
                        })}
                      </Flex>
                    ),
                  });
                });
            }}
          >
            <Flex vertical gap="middle">
              <Form.Item noStyle name="uid">
                <Input type="text" placeholder="Username" />
              </Form.Item>
              <Form.Item noStyle name="password">
                <Input type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item noStyle name="name">
                <Input type="text" placeholder="Nama" />
              </Form.Item>
              <Form.Item noStyle name="Telp">
                <Input type="text" placeholder="phone" />
              </Form.Item>
              <Form.Item noStyle name="active">
                <Radio.Group
                  block
                  name="active"
                  optionType="button"
                  buttonStyle="solid"
                  options={[
                    {
                      label: "AKTIF",
                      value: 1,
                    },
                    {
                      label: "NON AKTIF",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={user.state.status == "loading"}
                >
                  Submit
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
