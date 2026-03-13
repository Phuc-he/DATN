import { Button, Form, Input, Modal, notification, Popconfirm, Select } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateBook } from "../../services/bookService";
import { editBook } from "../../actions/book";
import { getAuthors, getDetailAuthor } from "../../services/authorService";
import { getCategories, getDetailCategory } from "../../services/categoryService";

const { Option } = Select;
const rules = [
  { 
    required: true, 
    message: 'Vui lòng không bỏ trống trường này!' 
  }
];

function UpdateBook (props) {
  const { item, handleDelete } = props;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [dataAuthors, setDataAuthors] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);

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

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    showModal();
  };

  const handleSubmit = async (values) => {
    const result = await updateBook(values, values.id);
    const category = await getDetailCategory(values.categoryId);
    const author = await getDetailAuthor(values.authorId);

    const updatedRecord = {
      ...values,
      key: values.id,
      categoryName: category?.name || 'Không có',
      authorName: author?.name || 'Không có',
      createdAt: new Date(values.createdAt).toLocaleDateString(),
      actions: (
        <>
          <UpdateBook
            handleDelete={handleDelete}
            item={{
              ...values,
              category: category || {name: "Không có"},
              author: author || {name: "Không có"}
            }}
          />
          <Popconfirm
            title="Xóa sách"
            description="Bạn có chắc xóa sách này?"
            okText="Đồng ý"
            cancelText="Hủy bỏ"
            onConfirm={() => handleDelete(values.id)}
          >
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </>
      )
    };
    
    if(result) {
      dispatch(editBook(updatedRecord));
      onCancel();
      api['success']({
        message: `Sửa thông tin sách thành công!`,
        duration: 1.5
      });
    }
  }

  return (
    <>
      {contextHolder}
      <Button className='mr-1' type="primary" onClick={() => handleEdit(item)}>Sửa</Button>
      <Modal
        title="Cập nhật thông tin sách"
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
          >
            <Select placeholder="Chọn thể loại">
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
          >
            <Select placeholder="Chọn tác giả">
              {dataAuthors.map((author) => (
                <Option key={author.id} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày tạo" name="createdAt">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Ngày cập nhật" name="updatedAt">
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

export default UpdateBook ;