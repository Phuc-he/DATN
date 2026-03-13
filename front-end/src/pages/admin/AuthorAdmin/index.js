import { useEffect, useState } from 'react';
import { Button, Divider, Flex, notification, Popconfirm, Radio, Table } from 'antd';
import { delAuthor, getAuthors } from '../../../services/authorService';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAuthor, setAuthor } from '../../../actions/author';
import UpdateAuthor from '../../../components/Author/UpdateAuthor';
import CreateAuthor from '../../../components/Author/CreateAuthor';

const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Bio',
    dataIndex: 'bio',
  },
  {
    title: "Ảnh",
    dataIndex: "profileImage",
    render: (url, record) => (
      <img 
        src={url} 
        alt={record.name} 
        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }} 
      />
    )
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

function AuthorAdmin () {
  const [selectionType, setSelectionType] = useState('checkbox');
  const author = useSelector(state => state.authorReducer);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchApi = async () => {
        const result = await getAuthors();
        dispatch(setAuthor(result.content));
    }
    fetchApi();
  }, [])

  const handleDelete = async (id) => {
    await delAuthor(id);
    dispatch(deleteAuthor(id));
    api['success']({
        message: `Xóa thông tin tác giả thành công!`,
        duration: 1.5
      });
  }

  const data = author.map(item => {
    const date = new Date(item.createdAt).toLocaleDateString();

    return {
      key: item.id,
      name: item.name,
      bio: item.bio,
      profileImage: item.profileImage,
      createdAt: date,
      actions: (
        <>
          <UpdateAuthor item={item}/>
          <Popconfirm
            title="Xóa tác giả"
            description="Bạn có chắc xóa tác giả này?"
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
      <h1>Tác giả</h1>
      <Flex justify='space-between' align='center'>
        <Radio.Group onChange={e => setSelectionType(e.target.value)} value={selectionType}>
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <CreateAuthor/>
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

export default AuthorAdmin;