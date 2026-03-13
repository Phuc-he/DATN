import { Modal } from "antd";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { InfoOutlined } from "@ant-design/icons";

function PrivateRoute () {
    const token = Cookies.get("token");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCancel = () => {
        setIsModalOpen(false);
        navigate('/');
    };
    return (
        <>
            {token ? <Outlet/> : (
                <>
                    <Modal
                        title="Thông báo"
                        icon={<InfoOutlined />}
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <p>Vui lòng đăng nhập để sử dụng tính năng!</p>
                    </Modal>
                </>
            )}
        </>
    )
}

export default PrivateRoute;