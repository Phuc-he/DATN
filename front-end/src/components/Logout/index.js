import Cookies from 'js-cookie';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setCart } from '../../actions/cart';
import { addPost } from '../../services/cartService';

function Logout (props) {
    const { setUsername } = props;
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api['success']({
            message: `Đăng xuất thành công!`,
            duration: 2
        });
    };

    const handleClick = async () => {
        Cookies.remove('token');
        Cookies.remove('userId');
        Cookies.remove('cart');
        Cookies.remove('fullName');
        setUsername("");
        const options = {
            cartItems: [],
            userId: ""
        };
        const cart = await addPost(options);
        Cookies.set("cart", cart.id, { expires: 365 });
        dispatch(setCart([]));
        openNotification();
    }

    return (
        <>
            {contextHolder}
            <div onClick={handleClick}>Đăng xuất</div>
        </>
    )
}

export default Logout;