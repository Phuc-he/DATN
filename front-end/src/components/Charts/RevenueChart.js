import { Line } from '@ant-design/plots';

function RevenueChart() {
  const dataRevenue = [
    { 'month': 'Jan', 'revenue': 12000000 },
    { 'month': 'Feb', 'revenue': 13500000 },
    { 'month': 'Mar', 'revenue': 15000000 },
    { 'month': 'Apr', 'revenue': 16500000 },
    { 'month': 'May', 'revenue': 18000000 },
    { 'month': 'Jun', 'revenue': 22000000 },
  ];

  const configRevenue = {
    data: dataRevenue,
    xField: 'month',
    yField: 'revenue',
    point: true,
    shape: 'smooth',
  };

  return (
    <>
      <h2>Doanh thu theo tháng</h2>
      <Line {...configRevenue} />
    </>
  );
}

export default RevenueChart;
