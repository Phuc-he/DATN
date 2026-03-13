import { Column } from '@ant-design/plots';

function BookSoldedChart () {
  const dataBook = [
    { 'Month': 'Jan', 'sold': 120 },
    { 'Month': 'Feb', 'sold': 150 },
    { 'Month': 'Mar', 'sold': 170 },
    { 'Month': 'Apr', 'sold': 200 },
    { 'Month': 'May', 'sold': 220 },
  ];

  const configBook = {
    data: dataBook,
    xField: 'Month',
    yField: 'sold',
    // colorField: 'name',
    // group: true,
    
  };
  return(
    <>
      <h2>Số lượng sách đã bán hàng tháng</h2>
      <Column {...configBook} />
    </>
  )
}

export default BookSoldedChart;