import { Pie } from '@ant-design/plots';

function OrderStatusPieChart() {
  const data = [
    { type: 'Đơn hoàn thành', value: 120 },
    { type: 'Đang xử lý', value: 45 },
    { type: 'Bị hủy / trả', value: 25 },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    color: ['#52c41a', '#faad14', '#ff4d4f'],
    radius: 0.8,
  
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
    ],
    statistic: {
      title: {
        content: 'Trạng thái',
      },
      content: {
        content: `${data.reduce((acc, cur) => acc + cur.value, 0)} đơn`,
      },
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Thống kê đơn hàng</h2>
      <Pie {...config} />
    </div>
  );
}

export default OrderStatusPieChart;
