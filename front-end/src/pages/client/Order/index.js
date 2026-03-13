import { Button, Card, Flex, Form, Input } from "antd";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { getCart, updatePatch } from "../../../services/cartService";
import { Link, useNavigate } from "react-router-dom";
import { getBookById } from "../../../services/bookService";
import { getInfoUser } from "../../../services/userService";
import { useDispatch } from "react-redux";
import { setCart } from "../../../actions/cart";
import { createNewOrder } from "../../../services/orderService";
import { formatCurrency } from "../../../utils/formatCurrency";

function Order () {
    const [form] = Form.useForm();
    const [dataCart, setDataCart] = useState([]);
    const [dataUser, setDataUser] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApi = async () => {
            const cartId = Cookies.get("cart");
            const cart = await getCart(cartId);
            if (cart) {
                const newData = await Promise.all(
                    cart.cartItems.map(async (item) => {
                        const bookInfo = await getBookById(item.bookId);
                        return {
                            id: item.bookId,
                            info: bookInfo,
                            quantity: item.quantity
                        };
                    })
                );
                setDataCart(newData);
            }

            const user = await getInfoUser(Cookies.get("userId"));
            setDataUser(user);            
        }

        fetchApi();
    }, []);

    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue(dataUser);
        }
    }, [dataUser, form]); 

    const total = dataCart.reduce((sum, item) => {
        const priceNew = ((item.info.price*(1 - (item.info.discount/100 || 0))));
        return sum + priceNew*item.quantity;        
    }, 0)

    const handleFinish = async (values) => {
        const orderData = {
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            cartId: Cookies.get("cart"),
            orderItems: dataCart.map((item) => {
                return {
                    bookId: item.info.id,
                    quantity: item.quantity,
                    unitPrice: item.info.price,
                }
            })
        };

        const response = await updatePatch({cartItems: []}, Cookies.get('cart'));
        const newOrder = await createNewOrder(orderData, dataUser.id);
        console.log(newOrder);
        
        dispatch(setCart(response.cartItems));
        navigate("/result");
    };

    return (
        <>
            <Card title={<h2>Thông tin đặt hàng</h2>}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ maxWidth: '80%', margin: '0 auto' }}
            >
                <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                <Input.TextArea rows={3} />
                </Form.Item>

                <h2>Thông tin các mặt hàng đã đặt</h2>
                {dataCart.length > 0 ? (
                    <>
                        {dataCart.map((item) => {
                            return (
                                <>
                                    <Flex align="flex-start" justify="flex-start" style={{ maxWidth: '80%', margin: '30px auto' }}>
                                        <div className="cart__image">
                                        <img  src={item.info.thumbnail} alt={item.info.title} />
                                        </div>
                                        <div className="cart__content">
                                            <h3 style={{margin: 0}}>{item.info.title}</h3>
                                            <div className="cart__quantity">
                                                Số lượng: {item.quantity}
                                            </div>
                                            <div className="cart__price-new">
                                                {formatCurrency((item.info.price * (1 - item.info.discount/100)) || item.info.price)}đ
                                            </div>
                                            <Flex justify="flex-end">
                                                <div className="cart__total">
                                                    Tổng tiền: <span>{formatCurrency((item.info.price * (1 - item.info.discount/100)) * item.quantity)}đ</span>
                                                </div>
                                            </Flex>
                                        </div>
                                    </Flex>
                                </>
                            )
                        })}
                        <div className="cart__total">
                            Thành tiền: <span>{formatCurrency(total)}đ</span>
                        </div>
                    </>
                ): (
                    <>
                        <div className="cart__empty">
                            Giỏ hàng trống
                        </div>
                            <Button size="large">
                                <Link to="/">Quay lại trang chủ</Link>
                            </Button>
                    </>
                )}

            <Form.Item
                wrapperCol={{
                    span: 24, // full width
                    style: { 
                        textAlign: "right",
                        marginTop: 20 
                    }
                }}
            >
                <Button type="primary" size="large" htmlType="submit">Xác nhận đặt hàng</Button>
                </Form.Item>
            </Form>
            </Card>
        </>
    )
}

export default Order;