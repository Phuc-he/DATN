import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setCart } from '../../actions/cart';
import { getCart } from '../../services/cartService';

function CartMini () {
    const cart = useSelector(state => state.cartReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCart = async () => {
            const cartId = Cookies.get("cart");
            if (cartId) {
                const response = await getCart(cartId);
                if (response) {
                    const options = response.cartItems.map((itemCart) => {
                        return {
                            id: itemCart.bookId,
                            quantity: itemCart.quantity
                        }
                    })
                    
                    dispatch(setCart(options)); // Gửi vào Redux
                }
            }
        };

        fetchCart();
    }, []);

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <ShoppingCartOutlined /> Giỏ hàng ({count || 0})
        </>
    )
}

export default CartMini;