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
  UserOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Dependency } from "./App";

export function Root() {
  const { auth } = useContext(Dependency)!;
  const navigate = useNavigate();
  const location = useLocation();

  const items: any[] = [
    {
      key: "/app/dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: "/app/inventory",
      label: "Inventory",
      icon: <DatabaseOutlined />,
    },
    {
      key: "/app/order",
      label: "Order",
      icon: <AuditOutlined />,
    },
    {
      key: "/app/supplier",
      label: "Supplier",
      icon: <ShopOutlined />,
    },
    {
      key: "/app/customer",
      label: "Customer",
      icon: <UserOutlined />,
    },
    {
      key: "/app/report",
      label: "Report",
      icon: <BarChartOutlined />,
    },
    {
      key: "/app/product",
      label: "Product",
      icon: <ProductOutlined />,
    },
    {
      key: "/app/account",
      label: "Account",
      icon: <IdcardOutlined />,
    },
    {
      key: "/app/log",
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
          justifyContent: "end",
          alignItems: "center",
          padding: 0,
        }}
      >
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
            onClick={({ key }) => {
              if (key == "/app/logout") {
                auth.logout();
              } else {
                navigate(key);
              }
            }}
            style={{ width: "100%", border: "none" }}
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
