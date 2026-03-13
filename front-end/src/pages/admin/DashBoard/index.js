import { Col, Row } from 'antd';
import OrderStatusChart from '../../../components/Charts/OrderStatusChart';
import BookSoldedChart from '../../../components/Charts/BookSoldedChart';
import RevenueChart from '../../../components/Charts/RevenueChart';

function DashBoard() {

  return (
    <>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <RevenueChart/>
        </Col>
      </Row>
      <Row gutter={[30, 30]} className='mt-5'>
        <Col span={12}>
          <BookSoldedChart/>
        </Col>
        <Col span={12}>
          <OrderStatusChart/>
        </Col>
      </Row>
    </>
  );
}

export default DashBoard;
