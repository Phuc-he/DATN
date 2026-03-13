import Cookies from 'js-cookie';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

function LogoutAdmin () {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const openNotification = () => {
        api['success']({
            message: `Đăng xuất thành công!`,
            duration: 1
        });
    };

    const handleClick = async () => {
        Cookies.remove('accessToken');
        Cookies.remove('fullNameAdmin');
        
        openNotification();
        setTimeout(() => {
            navigate("/admin/login");
        }, 1000);
    }

    return (
        <>
            {contextHolder}
            <div onClick={handleClick}>Đăng xuất</div>
        </>
    )
}

export default LogoutAdmin;