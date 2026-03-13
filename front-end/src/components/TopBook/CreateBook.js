import { createStyles } from 'antd-style';
import { PlusOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Form, Input, Modal, notification, Popconfirm, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getAuthors } from '../../services/authorService';
import { getCategories } from '../../services/categoryService';
import { useDispatch } from 'react-redux';
import { createBook } from '../../actions/book';
import UpdateBook from './UpdateBook';
import { createNewBook } from '../../services/bookService';

const { Option } = Select;
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

function CreateBook (props) {
  const { handleDelete } = props;
  const { styles } = useStyle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [dataAuthors, setDataAuthors] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApi = async () => {
      const resultAuthors = await getAuthors();
      const resultCategories = await getCategories();

      setDataAuthors(resultAuthors.content);
      setDataCategories(resultCategories.content);
    }

    fetchApi();
  }, [])

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const result = await createNewBook(values);
    const item = {
      ...result,
      key: result.id,
      categoryName: dataCategories.find(cat => cat.id === result.categoryId)?.name || 'Không rõ',
      authorName: dataAuthors.find(auth => auth.id === result.authorId)?.name || 'Không rõ',
      actions: (
        <>
          <UpdateBook item={result} handleDelete={handleDelete} />
          <Popconfirm
            title="Xóa sách"
            description="Bạn có chắc xóa sách này?"
            okText="Đồng ý"
            cancelText="Hủy bỏ"
            onConfirm={() => handleDelete(result.id)}
          >
            <Button type='primary' danger>Xóa</Button>
          </Popconfirm>
        </>
      )
    }

    dispatch(createBook(item));
    onCancel();
    api['success']({
      message: `Thêm thông tin sách thành công!`,
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
        title="Thêm mới thông tin sách"
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
            label="Ảnh"
            name="imageUrl"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={rules}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            label="Giảm giá (%)"
            name="discount"
          >
            <Input type="number" step="1" min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="Tồn kho"
            name="stock"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Thể loại"
            name="categoryId"
            rules={rules}
          >
            <Select placeholder="Chọn thể loại" >
              {dataCategories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tác giả"
            name="authorId"
            rules={rules}
          >
            <Select placeholder="Chọn tác giả"  >
              {dataAuthors.map((author) => (
                <Option key={author.id} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item >
            <Button htmlType='submit' type='primary'>Tạo</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CreateBook;