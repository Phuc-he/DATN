import { Button, Checkbox, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { loginPostV2 } from "../../services/authService";
import Cookies from 'js-cookie';
import { getCartByUser, updatePatch } from "../../services/cartService";
import { useDispatch } from "react-redux";
import { setCart } from "../../actions/cart";
import { getUser } from "../../actions/user";

const rules = [{ 
    required: true, 
    message: 'Vui lòng không để trống!' 
}];

function Login (props) {
    const { setUsername } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();

    const openNotification = (name) => {
        if(name) {
            api['success']({
                message: `Đăng nhập thành công!`,
                description: `Xin chào ${name}`,
                duration: 2
            });
        }
        else {
            api['error']({
                message: `Đăng nhập thất bại!`,
                description: `Sai tài khoản hoặc mật khẩu`,
                duration: 2
            });
        }
    };
    
    const showModal = () => {
        setIsModalOpen(true);
    };
    const onCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    }

    const onFinish = async (values) => {
        const response = await loginPostV2(values);
        
        if(!response.message){
            setIsModalOpen(false);
            dispatch(getUser(response));
            const cart = await getCartByUser(response.id);
            
            if(cart.length > 0) {
                Cookies.set("cart", cart[0].id);
                const options = cart[0].cartItems.map((itemCart) => {
                        return {
                            id: itemCart.bookId,
                            quantity: itemCart.quantity
                        }
                    })
                    
                dispatch(setCart(options));
            }
            else {
                const result = await updatePatch({
                    userId: response.id
                }, Cookies.get("cart"));

                const options = result.cartItems.map((itemCart) => {
                        return {
                            id: itemCart.bookId,
                            quantity: itemCart.quantity
                        }
                    })
                    
                dispatch(setCart(options));
            }
            Cookies.set('userId', response.id, { expires: 7 })
            Cookies.set('token', response.accessToken, { expires: 7 })
            Cookies.set('fullName', response.fullName, { expires: 7 })
            openNotification(response.fullName);
            setUsername(response.fullName);
        }
        else {
            openNotification();
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div onClick={showModal}>Đăng nhập</div>
            <Modal
                title="Đăng nhập tài khoản"
                open={isModalOpen}
                onCancel={onCancel}
                footer={null}
            >
                <Form
                    layout="horizontal"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={form}
                    labelAlign="left"
                >
                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={rules}
                        preserve={true}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={rules}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Ghi nhớ tài khoản</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary"  htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Login;