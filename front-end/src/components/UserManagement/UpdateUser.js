import { Button, Form, Input, Modal, notification, Select } from "antd";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateUser } from "../../services/userService";
import { editUser } from "../../actions/user";

const { Option } = Select;

const rules = [
  { 
    required: true, 
    message: 'Vui lòng không bỏ trống trường này!' 
  }
];

function UpdateUser (props) {
  const { item } = props;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record); 
    showModal();
  };

  const handleSubmit = async (values) => {
    const result = await updateUser(values, values.id);
    if(result) {
      dispatch(editUser(values))
      onCancel();
      api['success']({
        message: `Sửa thông tin tài khoản thành công!`,
        duration: 1.5
      });
    }
  }
  return (
    <>
      {contextHolder}
      <Button className='mr-1' type="primary" onClick={() => handleEdit(item)}>Sửa</Button>
      <Modal
        title="Cập nhật thông tin tài khoản"
        open={isModalOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Form 
          form={form} 
          layout="vertical"
          // initialValues={item}
          onFinish={handleSubmit}
        >
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: "email", required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Họ và tên" name="fullName" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Ngày tạo" name="createdAt">
            <Input disabled />
          </Form.Item>
        <Form.Item >
          <Button htmlType='submit' type='primary'>Cập nhật</Button>
        </Form.Item>
      </Form>
      </Modal>
    </>
  )
}

export default UpdateUser ;