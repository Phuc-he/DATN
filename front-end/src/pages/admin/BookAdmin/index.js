import { useCallback, useEffect, useState } from 'react';
import { Button, Divider, Flex, notification, Popconfirm, Radio, Table } from 'antd';
import { delBook, getBook } from '../../../services/bookService';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBook, setBook } from '../../../actions/book';
import UpdateBook from '../../../components/TopBook/UpdateBook';
import CreateBook from '../../../components/TopBook/CreateBook';
import { formatCurrency } from '../../../utils/formatCurrency';

const columns = [
  {
    title: "Ảnh",
    dataIndex: "imageUrl",
    render: (url, record) => (
      <img 
        src={url} 
        alt={record.title} 
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }} 
      />
    )
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
  },
  {
    title: 'Giảm giá (%)',
    dataIndex: 'discount',
  },
  {
    title: 'Số lượng',
    dataIndex: 'stock',
  },
  {
    title: 'Danh mục',
    dataIndex: 'categoryName',
  },
  {
    title: 'Tác giả',
    dataIndex: 'authorName',
  },
  {
    title: 'Thời gian tạo',
    dataIndex: 'createdAt',
  },
  {
    title: 'Hành động',
    width: 160,
    dataIndex: 'actions',
    fixed: 'right'
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

function BookAdmin () {
  const [selectionType, setSelectionType] = useState('checkbox');
  const book = useSelector(state => state.bookReducer);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const handleDelete = useCallback(async (id) => {
    await delBook(id);
    dispatch(deleteBook(id));
    api['success']({
      message: `Xóa thông tin thể loại thành công!`,
      duration: 1.5
    });
  }, [api, dispatch])

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getBook();

      const data = result.content.map( (item) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        
        return {
            key: item.id,
            id: item.id,
            imageUrl: item.imageUrl,
            title: item.title,
            description: item.description,
            price: formatCurrency(item.price),
            discount: item.discount,
            stock: item.stock,
            categoryId: item.categoryId,
            authorId: item.authorId,
            categoryName: item.categoryName,
            authorName: item.authorName,
            createdAt: date,
            actions: (
              <>
                <UpdateBook handleDelete={handleDelete} item={item}/>
                <Popconfirm
                  title="Xóa sách"
                  description="Bạn có chắc xóa sách này?"
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Button type='primary' danger>Xóa</Button>
                </Popconfirm>
              </>
            )
        };
      });

      dispatch(setBook(data));      
    }
    fetchApi();
  }, [dispatch, handleDelete])

  return (
      <>
        {contextHolder}
        <h1>Sách</h1>
        <Flex justify='space-between' align='center'>
          <Radio.Group onChange={e => setSelectionType(e.target.value)} value={selectionType}>
            <Radio value="checkbox">Checkbox</Radio>
            <Radio value="radio">Radio</Radio>
          </Radio.Group>
          <CreateBook handleDelete={handleDelete}/>
        </Flex>
        <Divider />
        <Table
            rowSelection={Object.assign({ type: selectionType }, rowSelection)}
            columns={columns}
            dataSource={book}
            pagination={{pageSize: 5}}
            scroll={{x: 'max-content'}}
        />
      </>
  )
}

export default BookAdmin;