import { createStyles } from 'antd-style';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Modal, notification, Popconfirm, Select } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewUser } from '../../services/userService';
import { createUser } from '../../actions/user';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const rules = [
  { 
    required: true, 
    message: 'Vui lòng không bỏ trống trường này!' 
  }
];

function CreateUser(props) {
  const { role } = props;
  const { styles } = useStyle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const newValues = {
      ...values,
      role: role
    };

    const result = await createNewUser(newValues);
    if(result.message){
      api['error']({
        message: `Thêm thông tin người dùng thất bại!`,
        duration: 1.5
      });
    }
    else {
      dispatch(createUser(result));
      onCancel();
      api['success']({
        message: `Thêm thông tin người dùng thành công!`,
        duration: 1.5
      });
    }
  }

  return (
    <>
      {contextHolder}
      <ConfigProvider
        button={{
          className: styles.linearGradientButton,
        }}
      >
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />}
          onClick={showModal}
        >
            Thêm mới
        </Button>
      </ConfigProvider>
      <Modal
        title="Thêm mới thông tin người dùng"
        open={isModalOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Form 
          form={form} 
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Tên đăng nhập" name="username" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: "email", required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Họ và tên" name="fullName" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={rules}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item >
            <Button htmlType='submit' type='primary'>Tạo</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CreateUser;