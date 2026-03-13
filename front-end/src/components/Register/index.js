import { Button, Checkbox, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { checkUserExist, registerPost } from "../../services/authService";
import Cookies from 'js-cookie';
import { generateRandomString } from "../../utils/generate";
import { createNewUser } from "../../services/userService";
import { updatePatch } from "../../services/cartService";

const rules = [{ 
    required: true, 
    message: 'Vui lòng không để trống!' 
}];

function Register (props) {
    const {setUsername} = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (name) => {
        if(name) {
            api['success']({
                message: `Đăng ký thành công!`,
                description: `Xin chào ${name}`,
                duration: 2
            });
        }
        else {
            api['error']({
                message: `Đăng ký thất bại!`,
                description: `Có lỗi trong quá trình đăng ký!`,
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
        const result = await createNewUser({
            ...values,
            role: 'CUSTOMER'
        });
        console.log(result);
        if(result.message) {
            api['error']({
                message: `Đăng ký thất bại!`,
                description: result.message,
                duration: 2
            });
        }
        else {
            setUsername(result.fullName);
            setIsModalOpen(false);

            const options = {
                userId: result.id
            };
            await updatePatch(options, Cookies.get("cart"));

            Cookies.set('token', result.accessToken, { expires: 7 })
            Cookies.set('fullName', result.fullName, { expires: 7 })
            Cookies.set('userId', result.id, { expires: 7 })
            openNotification(result.fullName);
        }
    }


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div onClick={showModal}>Đăng ký</div>
            <Modal
                title="Đăng ký tài khoản"
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
                        label="Họ và tên"
                        name="fullName"
                        rules={rules}
                        preserve={true}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={rules}
                        preserve={true}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
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
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Ghi nhớ tài khoản</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary"  htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Register;