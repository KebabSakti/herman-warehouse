import {
  ApartmentOutlined,
  AuditOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DiffOutlined,
  DollarOutlined,
  IdcardOutlined,
  LogoutOutlined,
  ProductOutlined,
  SnippetsOutlined,
  TeamOutlined,
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
      key: "1",
      label: "Menu",
      type: "group",
    },
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
      icon: <TeamOutlined />,
    },
    {
      key: currentMenuKey("/app/customer"),
      label: "Customer",
      icon: <UserOutlined />,
    },
    {
      key: currentMenuKey("/app/product"),
      label: "Product",
      icon: <ProductOutlined />,
    },
    {
      key: currentMenuKey("/app/account"),
      label: "Akun",
      icon: <IdcardOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Laporan",
      type: "group",
      children: [
        {
          key: currentMenuKey("/app/sales"),
          label: "Penjualan",
          icon: <BarChartOutlined />,
        },
        {
          key: currentMenuKey("/app/bill"),
          label: "Hutang",
          icon: <SnippetsOutlined />,
        },
        {
          key: currentMenuKey("/app/credit"),
          label: "Piutang",
          icon: <DiffOutlined />,
        },
        {
          key: currentMenuKey("/app/profit"),
          label: "Profit",
          icon: <DollarOutlined />,
        },
        {
          key: currentMenuKey("/app/stock"),
          label: "Stok",
          icon: <ApartmentOutlined />,
        },
      ],
    },
    {
      type: "divider",
    },
    // {
    //   key: currentMenuKey("/app/report"),
    //   label: "Laporan",
    //   icon: <BarChartOutlined />,
    //   children: [
    //     {
    //       key: currentMenuKey("/app/report/sale"),
    //       label: "Penjualan",
    //       type: "group",
    //     },
    //   ],
    // },
    // {
    //   key: currentMenuKey("/app/log"),
    //   label: "Log",
    //   icon: <FileSearchOutlined />,
    // },
    {
      key: "/app/logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <>
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
            style={{
              backgroundColor: "#fff",
              borderRight: "1px solid #ededed",
            }}
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
    </>
  );
}
