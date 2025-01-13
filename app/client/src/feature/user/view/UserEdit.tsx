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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Dependency } from "../../../component/App";
import { User, userUpdateSchema } from "../model/user_type";
import { useUserHook } from "./UserHook";

export function UserEdit() {
  const { auth, userController } = useContext(Dependency)!;
  const param = useParams();
  const user = useUserHook(userController);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Text } = Typography;

  useEffect(() => {
    if (user.state.action == "idle" && user.state.status == "idle") {
      user.read(param.id!, { token: auth.state.data! });
    }

    if (user.state.action == "update" && user.state.status == "complete") {
      if (user.state.error == null) {
        notification.success({
          message: "Sukses",
          description: "Data berhasil di update",
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
        loading={user.state.data == null}
        title="Edit User"
        maskClosable={false}
        open={location.pathname.includes("/app/account/edit")}
        footer={null}
        onCancel={() => {
          const target =
            location.state?.from == null
              ? "/app/account?page=1&limit=10"
              : location.state.from;

          navigate(target);
        }}
      >
        {(() => {
          if (user.state.data != null) {
            const userData = user.state.data as User;

            return (
              <>
                <Spin spinning={user.state.status == "loading"}>
                  <Form
                    size="large"
                    form={form}
                    style={{ paddingTop: "14px" }}
                    initialValues={{
                      uid: userData.uid,
                      active: userData.active,
                      name: userData.name,
                      phone: userData.phone,
                    }}
                    onFinish={async (values) => {
                      const payload = {
                        ...values,
                        id: userData.id,
                      };

                      await userUpdateSchema
                        .validate(payload)
                        .then(() => {
                          user.update(userData.id, payload, {
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
                      <Form.Item noStyle name="phone">
                        <Input type="text" placeholder="Telp" />
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
              </>
            );
          }
        })()}
      </Modal>
    </>
  );
}
