import { Form, Input, Button, Select, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInfoUser, updateUser } from "../../../services/userService";
import Cookies from "js-cookie";
import { editUser } from "../../../actions/user";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function UserInfo() {
  const [form] = Form.useForm();
  const [infoUser, setInfoUser] = useState({});
  const dispatch = useDispatch();
  const [api, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Lấy user từ redux
  const user = useSelector((state) => state.userReducer);

  // Nếu không còn login thì redirect
  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (!token || !userId || !user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFinish = async (values) => {
    const newInfoUser = {
      ...infoUser,
      ...values,
    };

    if (values.fullName) {
      Cookies.set("fullName", values.fullName, { expires: 7 });
    }

    const result = await updateUser(newInfoUser, infoUser.id);
    if (result) {
      dispatch(editUser(newInfoUser));
      api.open({
        type: "success",
        content: `Sửa thông tin tài khoản thành công!`,
        duration: 1.5,
      });
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      const data = await getInfoUser(Cookies.get("userId"));
      if (data) {
        setInfoUser(data);
        form.setFieldsValue(data);
      }
    };

    fetchApi();
  }, []);

  return (
    <>
      {contextHolder}
      {infoUser && (
        <Card
          title="Thông tin User"
          className="max-w-xl mx-auto shadow-md rounded-lg"
        >
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username" }]}
            >
              <Input placeholder="Nhập username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn role" }]}
            >
              <Select>
                <Option value="ADMIN">ADMIN</Option>
                <Option value="AUTHOR">AUTHOR</Option>
                <Option value="CUSTOMER">CUSTOMER</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Họ và tên" name="fullName">
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  pattern: /^[0-9\-\+]{9,15}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Lưu thông tin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </>
  );
}

export default UserInfo;