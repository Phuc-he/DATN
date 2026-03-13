import { useEffect, useState } from 'react';
import { Button, Divider, Flex, notification, Popconfirm, Radio, Table } from 'antd';
import { delUser, getUserByRole } from '../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, setUser } from '../../actions/user';
import UpdateUser from './UpdateUser';
import CreateUser from './CreateUser';

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    // render: text => <a>{text}</a>,
    fixed: 'left'
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: "Họ và tên",
    dataIndex: "fullName"
  },
  {
    title: "Địa chỉ",
    dataIndex: "address"
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone"
  },
  {
    title: "Vai trò",
    dataIndex: "role"
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

function UserManagement (props) {
  const { role } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const user = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchApi = async () => {
        const result = await getUserByRole(role);
        dispatch(setUser(result.content));
    }
    fetchApi();
  }, [])

  const handleDelete = async (id) => {
    await delUser(id);
    dispatch(deleteUser(id));
    api['success']({
      message: `Xoá thông tin người dùng thành công!`,
      duration: 1.5
    });
  }

  const data = user.map(item => {
    const date = new Date(item.createdAt).toLocaleDateString();

    return {
      key: item.id,
      username: item.username,
      email: item.email,
      fullName: item.fullName,
      address: item.address,
      phone: item.phone,
      role: item.role,
      createdAt: date,
      actions: (
        <>
          <UpdateUser item={item}/>
          <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc xóa người dùng này?"
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
      <h1>Danh sách người dùng</h1>
      <Flex justify='space-between' align='center'>
        <Radio.Group onChange={e => setSelectionType(e.target.value)} value={selectionType}>
            <Radio value="checkbox">Checkbox</Radio>
            <Radio value="radio">radio</Radio>
        </Radio.Group>
        <CreateUser role={role}/>
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

export default UserManagement;