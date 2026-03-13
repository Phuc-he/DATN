import { useEffect, useState } from 'react';
import { Button, Divider, Flex, notification, Popconfirm, Radio, Table } from 'antd';
import { delCategory, getCategories } from '../../../services/categoryService';
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, setCategory } from '../../../actions/category';
import UpdateCategory from '../../../components/Category/UpdateCategory';
import CreateCategory from '../../../components/Category/CreateCategory';

const columns = [
  {
    title: 'Tiêu đề',
    dataIndex: 'name',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
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

function CategoryAdmin () {
  const [selectionType, setSelectionType] = useState('checkbox');
  const category = useSelector(state => state.categoryReducer);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchApi = async () => {
        const result = await getCategories();
        dispatch(setCategory(result.content));
    }
    fetchApi();
  }, [dispatch])

  const handleDelete = async (id) => {
    await delCategory(id);
    dispatch(deleteCategory(id));
    api['success']({
      message: `Xóa thông tin thể loại thành công!`,
      duration: 1.5
    });
  }

  const data = category.map(item => {
    const date = new Date(item.createdAt).toLocaleDateString();

    return {
      key: item.id,
      name: item.name,
      description: item.description,
      createdAt: date,
      actions: (
        <>
          <UpdateCategory item={item}/>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc xóa danh mục này?"
            okText="Đồng ý"
            cancelText="Hủy bỏ"
            onConfirm={() => handleDelete(item.id)}
          >
            <Button type='primary' danger>Xóa</Button>
          </Popconfirm>
        </>
      )
    }
  })

  return (
    <>
      {contextHolder}
      <h1>Danh mục</h1>
      <Flex justify='space-between' align='center'>
        <Radio.Group onChange={e => setSelectionType(e.target.value)} value={selectionType}>
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <CreateCategory/>
      </Flex>
      
      <Divider />
      <Table
        rowSelection={Object.assign({ type: selectionType }, rowSelection)}
        columns={columns}
        dataSource={data}
        pagination={{pageSize: 5}}
          scroll={{x: 'max-content'}}
      />
    </>
  )
}

export default CategoryAdmin;