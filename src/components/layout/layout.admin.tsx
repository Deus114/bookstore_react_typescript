import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, App } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutApi } from 'services/api';
import ManageAccount from 'components/client/account/account.manage';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;


const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const handleLogout = async () => {
        let res = await logoutApi();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            message.success("Đăng xuất thành công!")
            navigate("/");
        }
    }

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to='/admin/user'>Manage Users</Link>,
            key: 'user',
            icon: <UserOutlined />
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <a onClick={() => handleLogout()}>
                <label
                    style={{ cursor: 'pointer' }}
                >Đăng xuất</label>
            </a>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    if (!isAuthenticated) return (<Outlet />);

    if (user?.role !== "ADMIN") return (<Outlet />);

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        Copyright &copy; 2025 <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>
            <ManageAccount
                isOpenModal={openManageAccount}
                setIsOpenModal={setOpenManageAccount}
            />
        </>
    );
};

export default LayoutAdmin;