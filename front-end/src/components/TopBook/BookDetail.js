import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Button, Spin, Rate, Alert, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
// --- Thêm các imports cần thiết cho giỏ hàng ---
import { useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from "../../actions/cart"; // CHỈNH SỬA ĐƯỜNG DẪN NÀY CHO ĐÚNG
import { getCart, updatePatch } from '../../services/cartService'; // CHỈNH SỬA ĐƯỜNG DẪN NÀY CHO ĐÚNG
import Cookies from 'js-cookie';
import { getBookById } from '../../services/bookService';
import { formatCurrency } from '../../utils/formatCurrency';

const { Title, Text, Paragraph } = Typography;

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    
    // --- KHAI BÁO CẦN THIẾT ---
    const dispatch = useDispatch();
    const cartId = Cookies.get("cart");
    // ---------------------------

    useEffect(() => {
        // ... (Logic fetch sách vẫn giữ nguyên)
        const fetchBook = async () => {
            setLoading(true);
            try {
                const response = await getBookById(id);
                setBook(response.data || response); 
            } catch (err) {
                setError("Không thể tải chi tiết sách. Vui lòng thử lại sau.");
                console.error("Lỗi khi fetch chi tiết sách:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);
    
    // --- HÀM THÊM VÀO GIỎ HÀNG ĐƯỢC CHUYỂN TỪ BookItem QUA ---
    const handleAddToCart = async (item) => {
        // Kiểm tra xem đã có cartId chưa, nếu chưa thì nên có logic tạo giỏ hàng mới ở đây
        if (!cartId) {
             api['error']({
                message: `Lỗi Giỏ Hàng`,
                description: 'Không tìm thấy ID giỏ hàng. Vui lòng đăng nhập hoặc refresh trang.',
                duration: 3
            });
            return; 
        }

        try {
            const detailCart = await getCart(cartId);
            const index = detailCart.cartItems.findIndex(itemCart => itemCart.bookId.toString() === item.id.toString()); // So sánh bằng chuỗi để chắc chắn

            if (index >= 0) {
                // Tăng số lượng nếu sách đã có trong giỏ
                detailCart.cartItems[index].quantity += 1;
                
                const options = { cartItems: detailCart.cartItems };
                
                await updatePatch(options, cartId);
                dispatch(updateQuantity(item.id));
            } else {
                // Thêm sách mới vào giỏ
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
                // Dispatch action Redux để cập nhật số lượng trong state Redux
                dispatch(addToCart(item)); 
            }
            
            // Thông báo thành công
            api['success']({
                message: `Thêm sách "${item.title}" vào giỏ hàng thành công!`,
                duration: 2
            });

        } catch (e) {
             api['error']({
                message: `Lỗi Thêm Giỏ Hàng`,
                description: 'Đã xảy ra lỗi khi cập nhật giỏ hàng.',
                duration: 3
            });
            console.error("Lỗi khi thêm vào giỏ hàng:", e);
        }
    }
    // -----------------------------------------------------------


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }
    
    if (!book) {
        return <Alert message="Không tìm thấy sách" description={`Không tìm thấy sách với ID: ${id}`} type="warning" showIcon />;
    }
    
    // Tính toán giá mới và định dạng
    const newPrice = book.price * (1 - (book.discount || 0) / 100);
    const displayNewPrice = formatCurrency(newPrice);
    const displayOldPrice = formatCurrency(book.price);

    return (
        <div className="book-detail-page" style={{ padding: '30px 50px' }}>
            {contextHolder}
            <Row gutter={[40, 40]}>
                {/* Cột hình ảnh (giữ nguyên) */}
                <Col xs={24} md={10}>
                    <img 
                        src={book.imageUrl} 
                        alt={book.title} 
                        style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'block', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                </Col>

                {/* Cột thông tin chi tiết (giữ nguyên) */}
                <Col xs={24} md={14}>
                    <Title level={2}>{book.title}</Title>
                    
                    {/* ... (Đánh giá và chi tiết khác) ... */}
                    <div style={{ marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                        <Rate allowHalf defaultValue={book.rating || 4.5} disabled /> 
                        <Text strong style={{ marginLeft: '10px', marginRight: '30px' }}>{book.rating || '4.5'}</Text>
                        <Text type="secondary">Tác giả: **{book.authorName || 'Đang cập nhật'}**</Text>
                        <Text type="secondary" style={{ marginLeft: '20px' }}>Thể loại: **{book.categoryName || 'Khác'}**</Text>
                    </div>

                    {/* ... (Giá) ... */}
                     <div style={{ marginBottom: '20px', padding: '15px', background: '#e6f7ff', borderRadius: '5px' }}>
                        <Text strong style={{ fontSize: '1.2em', marginRight: '10px' }}>Giá:</Text>
                        {book.discount > 0 ? (
                            <>
                                <Title level={3} style={{ color: '#cf1322', display: 'inline-block', marginRight: '15px', margin: 0 }}>
                                    {displayNewPrice} đ
                                </Title>
                                <Text delete style={{ fontSize: '1.1em', color: '#8c8c8c' }}>
                                    {displayOldPrice} đ
                                </Text>
                                <Text type="danger" strong style={{ marginLeft: '10px' }}>
                                    Tiết kiệm: {book.discount}%
                                </Text>
                            </>
                        ) : (
                            <Title level={3} style={{ color: '#3f6600', margin: 0 }}>
                                {displayOldPrice} đ
                            </Title>
                        )}
                    </div>
                    
                    {/* Trạng thái và Hành động */}
                    <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                        <Text strong>Tồn kho: </Text>
                        <Text type={book.stock > 0 ? 'success' : 'danger'} style={{ marginLeft: '5px' }}>
                            {book.stock > 0 ? `${book.stock} cuốn` : 'Hết hàng'}
                        </Text>
                    </div>

                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<ShoppingCartOutlined />}
                        disabled={book.stock <= 0}
                        // GỌI HÀM MỚI TẠO VÀ TRUYỀN THÔNG TIN SÁCH
                        onClick={() => handleAddToCart(book)} 
                    >
                        Thêm vào giỏ hàng
                    </Button>
                    
                    <div style={{ marginTop: '30px' }}>
                        <Title level={4}>Mô tả chi tiết</Title>
                        <Paragraph style={{ lineHeight: '1.8' }}>{book.description || 'Sách hiện chưa có mô tả chi tiết.'}</Paragraph>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default BookDetail;