import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, notification, Rate } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from "../../actions/cart";
import { getCart, updatePatch } from '../../services/cartService';
import Cookies from 'js-cookie';
import { formatCurrency } from '../../utils/formatCurrency';

function BookItem (props) {
    const { pagination } = props;
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const cartId = Cookies.get("cart");

    const handleClick = async (item) => {
        const detailCart = await getCart(cartId);
        const index = detailCart.cartItems.findIndex(itemCart => itemCart.bookId === item.id)
        if(index >= 0) {
            detailCart.cartItems[index].quantity += 1;
            
            const options = {
                cartItems: detailCart.cartItems
            };
            
            await updatePatch(options, cartId);
            dispatch(updateQuantity(item.id));
        }
        else {
            const options = {
                cartItems: [
                    ...detailCart.cartItems,
                    {
                        bookId: item.id,
                        quantity: 1
                    }
                ]
            };

            await updatePatch(options, cartId);
            dispatch(addToCart(item));
        }
        api['success']({
            message: `Thêm sách vào giỏ hàng thành công!`,
            duration: 2
        });
    }

    return (
        <>
            {contextHolder}
            {pagination.currentItems.length > 0 ? (
                pagination.currentItems.map(item => (
                    <Col span={8} key={item.id}>
                        <div className="top-book" onClick={() => navigate(`/books/${item.id}`)}>
                            <div className="top-book__thumbnail">
                                <img src={item.imageUrl} alt={item.title}/>
                            </div>
                            <span className="top-book__discount">{item.discount || 0}% OFF</span>
                            <div className="top-book__content">
                                <h2 className="top-book__title">{item.title}</h2>
                                <div className="top-book__rate"><Rate className="top-book__rate" allowHalf defaultValue={4.5}/> <span>4.8</span></div>
                                
                                {/* Dòng giá mới đã được sửa */}
                                <div className="top-book__price-new">{formatCurrency((((item.price) * (1-item.discount/100)) || item.price))} đ</div>
                                
                                {/* Dòng giá cũ đã được sửa */}
                                <div className="top-book__price">{formatCurrency(item.price)} đ</div>
                                
                                
                            </div>
                        </div>
                        <Button onClick={() => handleClick(item)} type="primary" className="top-book__order">
                            <Link size="large"><ShoppingCartOutlined /> Thêm vào giỏ hàng</Link>
                        </Button>
                    </Col>
                ))
            ) : (
                <>
                    <h3>Không tìm thấy sách</h3>
                </>
            )}
        </>
    )
}

export default BookItem;