import { Button, Checkbox, Flex, Form, Input, notification } from 'antd';
import { loginPostV2 } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function LoginAdmin() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const onFinish = async (values) => {
    const response = await loginPostV2(values);
    
    if(!response.message){
      Cookies.set(Cookies.set('accessToken', response.accessToken, { expires: 1 }))
      Cookies.set(Cookies.set('fullNameAdmin', response.fullName, { expires: 1 }))
      api['success']({
        message: 'Đăng nhập thành công!',
        duration: 1
      });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      api['error']({
        message: 'Đăng nhập thất bại!',
        description:
          'Sai tài khoản hoặc mật khẩu',
      });
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      {contextHolder}
      <Flex vertical style={{height: '100vh'}} align='center' justify='center'>
        <h2>Đăng nhập quản trị</h2>
        <Form
          name="login-admin"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ minWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  )
}

export default LoginAdmin;
