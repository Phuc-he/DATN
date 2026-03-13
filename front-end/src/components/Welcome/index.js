import { Button } from "antd"
import "./Welcome.scss";
import { Link } from "react-router-dom";

function Welcome () {
    return (
        <>
            <div className="welcome">
                <div className="welcome__content">
                    <h1 className="welcome__title">Khám phá cuốn sách tuyệt vời tiếp theo của bạn</h1>
                    <p className="welcome__desc">Khám phá bộ sưu tập sách khổng lồ của chúng tôi ở mọi thể loại. Từ sách bán chạy nhất đến sách hiếm, chúng tôi có sách dành cho mọi độc giả. Miễn phí vận chuyển cho đơn hàng trên 500.000 đ.</p>
                    <Button className="welcome__button" type="primary"><Link to="/">Mua ngay</Link></Button>
                    <Button className="welcome__button">Tìm hiểu thêm</Button>
                </div>
            </div>
        </>
    )
}

export default Welcome