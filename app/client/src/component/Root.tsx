import {
  AuditOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ProductOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";
import { Dependency } from "./App";

export function Root() {
  const { auth } = useContext(Dependency)!;
  const navigate = useNavigate();
  const location = useLocation();
  const { Text } = Typography;

  function currentMenuKey(key: string): string {
    if (location.pathname.search(key) >= 0) {
      return location.pathname;
    } else {
      return key;
    }
  }

  const items: any[] = [
    {
      key: currentMenuKey("/app/dashboard"),
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: currentMenuKey("/app/inventory"),
      label: "Nota Supplier",
      icon: <DatabaseOutlined />,
    },
    {
      key: currentMenuKey("/app/order"),
      label: "Nota Kustomer",
      icon: <AuditOutlined />,
    },
    {
      key: currentMenuKey("/app/supplier"),
      label: "Supplier",
      icon: <ShopOutlined />,
    },
    {
      key: currentMenuKey("/app/customer"),
      label: "Customer",
      icon: <UserOutlined />,
    },
    {
      key: currentMenuKey("/app/report"),
      label: "Report",
      icon: <BarChartOutlined />,
    },
    {
      key: currentMenuKey("/app/product"),
      label: "Product",
      icon: <ProductOutlined />,
    },
    {
      key: currentMenuKey("/app/account"),
      label: "Account",
      icon: <IdcardOutlined />,
    },
    {
      key: currentMenuKey("/app/log"),
      label: "Log",
      icon: <FileSearchOutlined />,
    },
    {
      key: "/app/logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #ededed",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 0,
        }}
      >
        <Space>
          <img src={logo} style={{ width: "34px", marginLeft: "20px" }} />
          <Text strong>Pos System</Text>
        </Space>
        <Button type="link">Julian Aryo (Admin)</Button>
      </Header>
      <Layout>
        <Sider
          breakpoint="sm"
          width="20%"
          trigger={null}
          style={{ backgroundColor: "#fff", borderRight: "1px solid #ededed" }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["/app/dashboard"]}
            selectedKeys={[location.pathname]}
            items={items}
            style={{ width: "100%", border: "none" }}
            onClick={({ key }) => {
              if (key == "/app/logout") {
                auth.logout();
              } else {
                navigate(key);
              }
            }}
          />
        </Sider>
        <Content
          style={{
            overflowY: "scroll",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
