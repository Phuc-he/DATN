import { Modal } from "antd";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { InfoOutlined } from "@ant-design/icons";

function PrivateRouteAdmin () {
    const accessToken = Cookies.get("accessToken");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCancel = () => {
        setIsModalOpen(false);
        navigate('/admin/login');
    };
    return (
        <>
            {accessToken ? <Outlet/> : (
                <>
                    <Modal
                        title="Thông báo"
                        icon={<InfoOutlined />}
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <p>Vui lòng đăng nhập với vai trò Admin!</p>
                    </Modal>
                </>
            )}
        </>
    )
}

export default PrivateRouteAdmin;