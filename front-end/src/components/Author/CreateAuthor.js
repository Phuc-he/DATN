import { createStyles } from 'antd-style';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Modal, notification, Popconfirm, Select } from 'antd';
import { useState } from 'react';
import { createNewAuthor } from '../../services/authorService';
import { useDispatch } from 'react-redux';
import { createAuthor } from '../../actions/author';

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

function CreateAuthor() {
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
    const result = await createNewAuthor(values);

    dispatch(createAuthor(result));
    onCancel();
    api['success']({
      message: `Thêm thông tin tác giả thành công!`,
      duration: 1.5
    });
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
        title="Thêm mới thông tin tác giả"
        open={isModalOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Form 
          form={form} 
          layout="vertical"
          onFinish={handleSubmit}
        >
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
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            name="profileImage"
          >
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

export default CreateAuthor;