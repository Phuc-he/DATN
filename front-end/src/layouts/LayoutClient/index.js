import Cookies from 'js-cookie';
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { Button, Col, Dropdown, Flex, Layout, Menu, Row } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
// import logo from "../../images/logo.png";
import "./LayoutDefault.scss";
import { BankOutlined, ClockCircleOutlined, CreditCardOutlined, EnvironmentOutlined, FacebookOutlined, HomeOutlined, IdcardOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, PinterestOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import CartMini from "../../components/Cart/CartMini";
import Login from "../../components/Login";
import { useEffect, useState } from 'react';
import Logout from '../../components/Logout';
import CategoryMini from '../../components/Category/CategoryMini';
import { addPost } from '../../services/cartService';
import SearchInput from '../../components/SearchInput';
import Register from '../../components/Register';
import { useSelector } from 'react-redux';

function LayoutDefault () {
    const token = Cookies.get('token');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState(fullName);
    
    const user = useSelector(state => state.userReducer);
    
    const location = useLocation();
    const selectedKey = location.pathname.split('/')[1]; 
    
    useEffect(() => {
        window.scrollTo(0, 0);

        if(user.length > 0){
            setFullName(user[0].fullName);
        }
        const checkCart = async () => {
            if(!Cookies.get("cart")) {
                const options = {
                    cartItems: [],
                    userId: ""
                };
                const cart = await addPost(options);
                Cookies.set("cart", cart.id, { expires: 365 });
            }
        }

        checkCart();
    }, [location.pathname, user]);

    const items = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: <NavLink to="/">Trang chủ</NavLink>
        },
        {
            key: "/categories",
            label: <NavLink to="/categories"><CategoryMini/></NavLink>
        },
        {
            key: "/cart",
            label: <NavLink to="cart"><CartMini/></NavLink>
        },
        {
            key: "/orders-list",
            label: token && <NavLink to="orders-list">Đơn hàng</NavLink>
        }
    ]
    
    const login = [
        {
            key: "userinfo",
            label: <NavLink to="user-info">Thông tin tài khoản</NavLink>
        },
        {
            key: "logout",
            label: <Logout setUsername={setUsername}/>
        }
    ]

    const unLogin = [
        {
            key: "login",
            label: <Login setUsername={setUsername}/>
        },
        {
            key: "register",
            label: <Register setUsername={setUsername}/>
        }
    ]

    return (
        <>
            <Layout>
                <header className="header">
                    <Row gutter={[40, 20]}>
                        <Col span={4}>
                            <Flex justify='center' align='center' className="header__logo">
                                {/* <img src={logo} alt="Logo"/> */}
                                <h4>BOOK STORE</h4>
                            </Flex>
                        </Col>
                        <Col span={8}>
                            <div className="header__search">
                                <SearchInput />
                            </div>
                        </Col>
                        <Col span={10}>
                            <Menu className="header__menu"
                                mode="horizontal"
                                defaultSelectedKeys={[`/${selectedKey}`]}
                                items={items}
                                selectedKeys={[location.pathname]}
                                // style={{ flex: 1, minWidth: 0 }}
                            />
                        </Col>
                        <Col span={2}>
                            <div className="auth">
                                <Dropdown menu={{ items: token ? login : unLogin }} placement="bottom">
                                    <Button>{username ? username : <UserOutlined />}</Button>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                </header>
                <Content className="content">
                    <div
                        style={{
                            minHeight: 400,
                        }}
                    >
                    <Outlet/>
                    </div>
                </Content>
                <Footer className="footer">
                    <div className="footer__main">
                        <div className="footer__box">
                            <h3 className="footer__box__title">Book Store</h3>
                            <div className="footer__box__content">
                                <p>Điểm đến hàng đầu của bạn cho các sản phẩm chất lượng và trải nghiệm mua sắm tuyệt vời.</p>
                                <div className="footer__box__icons">
                                    <Link className="footer__box__icon"><FacebookOutlined /></Link>
                                    <Link className="footer__box__icon"><TwitterOutlined /></Link>
                                    <Link className="footer__box__icon"><InstagramOutlined /></Link>
                                    <Link className="footer__box__icon"><PinterestOutlined /></Link>
                            </div>
                            </div>    
                        </div>
                        <div className="footer__box">
                            <h3 className="footer__box__title">Shop</h3>
                            <ul className="footer__box__content">
                                <li><Link to="/" className="footer__box__desc">Sản phẩm mới</Link></li>
                                <li><Link to="/" className="footer__box__desc">Sản phẩm bán chạy nhất</Link></li>
                                <li><Link to="/" className="footer__box__desc">Xu hướng hiện nay</Link></li>
                                <li><Link to="/" className="footer__box__desc">Mặt hàng giảm giá</Link></li>
                                <li><Link to="/" className="footer__box__desc">Bộ sưu tập sách</Link></li>
                            </ul>
                        </div>
                        <div className="footer__box">
                            <h3 className="footer__box__title">Chăm sóc khách hàng</h3>
                            <ul className="footer__box__content">
                                <li><Link to="/" className="footer__box__desc">Liên hệ với chúng tôi</Link></li>
                                <li><Link to="/" className="footer__box__desc">Câu hỏi thường gặp</Link></li>
                                <li><Link to="/" className="footer__box__desc">Chính sách vận chuyển</Link></li>
                                <li><Link to="/" className="footer__box__desc">Đổi / Trả hàng</Link></li>
                                <li><Link to="/" className="footer__box__desc">Hướng dẫn</Link></li>
                            </ul>
                        </div>
                        <div className="footer__box">
                            <h3 className="footer__box__title">Contact Us</h3>
                            <ul className="footer__box__content">
                                <li className="flex items-start">
                                    <EnvironmentOutlined className="mr-1" />
                                    <span className="text-gray-400">123 Bac Tu Liem, Ha Noi, Viet Nam</span>
                                </li>
                                <li className="flex items-center">
                                    <PhoneOutlined className="mr-1" />
                                    <span className="text-gray-400">+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center">
                                    <MailOutlined className="mr-1" />
                                    <span className="text-gray-400">support@bookstore.com</span>
                                </li>
                                <li className="flex items-center">
                                    <ClockCircleOutlined className="mr-1" />
                                    <span className="text-gray-400">Mon-Fri: 9AM-6PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr/>

                    <div className="footer__copyright">
                        <div className="footer__copyright__content">
                            Copyright ©{new Date().getFullYear()} Created by Group 8
                        </div>
                        <div className="footer__copyright__box">
                            <Link to="/" className="footer__copyright__terms">Chính sách bảo mật</Link>
                            <Link to="/" className="footer__copyright__terms">Điều khoản dịch vụ</Link>
                            <div className="footer__copyright__icons">
                                <Link className="footer__box__icon"><CreditCardOutlined /></Link>
                                <Link className="footer__box__icon"><BankOutlined /></Link>
                                <Link className="footer__box__icon"><IdcardOutlined /></Link>
                            </div>
                        </div>
                    </div>
                </Footer>
            </Layout>
        </>
    )
}

export default LayoutDefault