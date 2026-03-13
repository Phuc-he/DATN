import DashBoard from "../../pages/admin/DashBoard";
import LayoutAdmin from "../../layouts/LayoutAdmin/index";
import CategoryAdmin from "../../pages/admin/CategoryAdmin";
import BookAdmin from "../../pages/admin/BookAdmin";
import AuthorAdmin from "../../pages/admin/AuthorAdmin";
import Setting from "../../pages/admin/Setting";
import UserAdmin from "../../pages/admin/UserAdmin";
import UserClient from "../../pages/admin/UserClient";
import LoginAdmin from "../../pages/admin/LoginAdmin/index";
import PrivateRouteAdmin from "../../components/PrivateRoute/PrivateRouteAdmin";
import Order from "../../pages/admin/Order";

export const routesAdmin = [
    {
        element: <PrivateRouteAdmin/>,
        children: [
            {
                path: "/admin",
                element: <LayoutAdmin/>,
                children: [
                    {
                        path: "dashboard",
                        element: <DashBoard/>,
                    },
                    {
                        index: true,
                        element: <DashBoard/>,
                    },
                    {
                        path: "categories",
                        element: <CategoryAdmin/>,
                    },
                    {
                        path: "books",
                        element: <BookAdmin/>,
                    },
                    {
                        path: "authors",
                        element: <AuthorAdmin/>,
                    },
                    {
                        path: "userClient",
                        element: <UserClient/>,
                    },
                    {
                        path: "userAdmin",
                        element: <UserAdmin/>,
                    },
                    {
                        path: "orders",
                        element: <Order/>,
                    },
                    {
                        path: "settings",
                        element: <Setting/>,
                    },
                ]
            }
        ]
    },
    {
        path: "admin/login",
        element: <LoginAdmin/>,
    }
]