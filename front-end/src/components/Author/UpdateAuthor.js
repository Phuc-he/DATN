import { Button, Form, Input, Modal, notification } from "antd";
import { updateAuthor } from "../../services/authorService";
import { editAuthor } from "../../actions/author";
import { useDispatch } from "react-redux";
import { useState } from "react";

const rules = [
  { 
    required: true, 
    message: 'Vui lòng không bỏ trống trường này!' 
  }
];

function UpdateAuthor(props) {
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
    // setSelectedRecord(record);
    form.setFieldsValue(record); 
    showModal();
  };

  const handleSubmit = async (values) => {
    const result = await updateAuthor(values, values.id);
    if(result) {
      dispatch(editAuthor(values))
      onCancel();
      api['success']({
        message: `Sửa thông tin tác giả thành công!`,
        duration: 1.5
      });
    }
  }
  return (
    <>
      {contextHolder}
      <Button className='mr-1' type="primary" onClick={() => handleEdit(item)}>Sửa</Button>
      <Modal
        title="Cập nhật thông tin tác giả"
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
          <Form.Item
              label="Tên"
              name="name"
              rules={rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
              label="Tiểu sử"
              name="bio"
              rules={rules}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
              label="Ảnh đại diện"
              name="profileImage"
          >
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

export default UpdateAuthor;