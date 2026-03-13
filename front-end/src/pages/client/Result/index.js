import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ResultOrder = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleToOrderList = () => {
    navigate('/orders-list');
  };

  return (
    <div style={{ paddingTop: 50 }}>
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle="Chúc mừng bạn đã đặt hàng thành công! Bạn sẽ nhận được đơn hàng trong 3-5 ngày tới."
        icon={<SmileOutlined />}
        extra={[
          <Button size='large' type="primary" key="orders-list" onClick={handleToOrderList}>
            Xem đơn hàng đã đặt
          </Button>,
          <Button size='large' key="home" onClick={handleBackHome}>
            Quay lại trang chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default ResultOrder;
