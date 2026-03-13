import { Menu } from "antd";
import { BookOutlined, DashboardOutlined, OrderedListOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaUsers, FaUsersCog, FaUserSecret } from "react-icons/fa";

function MenuSider () {
    const location = useLocation();
    const path = location.pathname;
    
    const items = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to={"/admin/dashboard"}>Dash board</Link>
        },
        {
            key: '/admin/categories',
            icon: <OrderedListOutlined />,
            label: <Link to={"/admin/categories"}>Quản lý danh mục</Link>
        },
        {
            key: '/admin/books',
            icon: <BookOutlined />,
            label: <Link to={"/admin/books"}>Quản lý sách</Link>,
        },
        {
            key: '/admin/authors',
            icon: <FaUserSecret />,
            label: <Link to={"/admin/authors"}>Quản lý tác giả</Link>,
        },
        {
            key: '/admin/user',
            icon: <FaUsers />,
            label: 'Quản lý người dùng',
            children: [
                {
                    key: '/admin/userAdmin',
                    icon: <FaUsersCog />,
                    label: <Link to={"/admin/userAdmin"}>Quản lý admin</Link>,
                },
                {
                    key: '/admin/userClient',
                    icon: <FaUser />,
                    label: <Link to={"/admin/userClient"}>Quản lý khách hàng</Link>,
                }
            ]
        },
        {
            key: '/admin/orders',
            icon: <FaUserSecret />,
            label: <Link to={"/admin/orders"}>Quản lý đơn hàng</Link>,
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: <Link to={"/admin/settings"}>Cài đặt chung</Link>,
        },
    ];

    return (
        <>
            <Menu
                // defaultOpenKeys={["/admin/dashboard"]}
                defaultSelectedKeys={[path]}
                mode="inline"
                items={items}
            />
        </>
    )
}

export default MenuSider;