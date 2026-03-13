import { useEffect, useState } from "react";
import { getOrderByUserId } from "../../../services/orderService";
import Cookies from 'js-cookie';
import { getInfoUser } from "../../../services/userService";
import { Button, Table } from "antd";
import "./Order.scss";
import { formatCurrency } from "../../../utils/formatCurrency";

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
  },
  {
    title: 'Thông tin khách hàng',
    dataIndex: 'userInfo',
  },
  {
    title: 'Sản phẩm đã đặt',
    dataIndex: 'orderItems',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalAmount',
  },
  {
    title: 'Trạng thái xử lý',
    dataIndex: 'status',
  },
  {
    title: 'Thời gian tạo',
    dataIndex: 'createdAt',
  },
];

// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
// };

function OrderList () {
  const [data, setData] = useState([]);

  const checkStatus = (item) => {
    if(item.status === "UNPROCESSED") {
      return( 
        <>
          <Button type="primary" danger>Đang xử lý</Button>
        </>
      )
    }
    else if(item.status === "SHIPPED"){
      return( 
        <>
          <Button type="primary" style={{background: 'greenyellow'}}>Đang giao</Button>
        </>
      )
    }
    else if(item.status === "DELIVERED") {
      return( 
        <>
          <Button type="primary" style={{background: 'green'}}>Đã hoàn thành</Button>
        </>
      )
    }
  }

  useEffect(()=> {
    const fetchApi = async () => {
      const user = await getInfoUser(Cookies.get('userId'));
      if(user) {
        const response = await getOrderByUserId(user.id);
        if(response) {
          const dataTable = response.content.map((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            return {
              key: index + 1,
              id: item.id,
              userInfo: (
                <>
                  <p>{item.userInfo.fullName}</p>
                  <p>{item.userInfo.phone}</p>
                  <p>{item.userInfo.address}</p>
                </>
              ),
              orderItems: (
                item.orderItems.map((itemOrder) => (
                  <div className="item-order" key={itemOrder.id}>
                    <h3>{itemOrder.bookTitle}</h3>
                    <p>Số lượng: {itemOrder.quantity}</p>
                    <p>Giá: {formatCurrency(itemOrder.unitPrice * (1 - itemOrder.discount/100))}</p>
                    {/* <p>Giảm giá: {itemOrder.discount}</p> */}
                  </div>
                ))
              ),
              totalAmount: formatCurrency(item.totalAmount),
              status: checkStatus(item),
              createdAt: date,
            }
          })
          setData(dataTable);
        }
      }
    }
    fetchApi();
  }, [])
  
  return (
    <>
      <Table
          columns={columns}
          dataSource={data}
          pagination={{pageSize: 5}}
          scroll={{x: 'max-content'}}
      />
    </>
  )
}

export default OrderList;