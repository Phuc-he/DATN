import LayoutDefault from "../../layouts/LayoutClient";
import Home from "../../pages/client/Home";
import Category from "../../pages/client/Category";
import Cart from "../../pages/client/Cart";
import AllCategory from "../../components/TopCategory/AllCategory";
import PrivateRoute from "../../components/PrivateRoute";
import Order from "../../pages/client/Order";
import SearchResult from "../../pages/client/SearchResult";
import ResultOrder from "../../pages/client/Result";
import OrderList from "../../pages/client/Order/OrderList";
import UserInfo from "../../pages/client/UserInfo";
import BookDetail from "../../components/TopBook/BookDetail";
import AuthorDetail from "../../pages/client/Author";

export const routesClient = [
    {
        path: "/",
        element: <LayoutDefault/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "/categories",
                element: <AllCategory/>,
                children: [
                    {
                        path: ":id",
                        element: <Category/>
                    }
                ]
            },
            {
                path: "/books/:id",
                element: <BookDetail/>,
            },
            {
                path: "/authors/:id",
                element: <AuthorDetail/>,
            },
            {
                path: "/cart",
                element: <Cart/>
            }, 
            {
                path: "/search",
                element: <SearchResult/>
            }, 
            {
                element: <PrivateRoute/>,
                children: [
                    {
                        path: "/user-info",
                        element: <UserInfo/>
                    },
                    {
                        path: "/orders",
                        element: <Order/>
                    },
                    {
                        path: "/orders-list",
                        element: <OrderList/>
                    },
                    {
                        path: "/result",
                        element: <ResultOrder/>
                    }
                ]
            }
        ]
    }
] 