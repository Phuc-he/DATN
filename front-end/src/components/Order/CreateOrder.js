import { Button, Form, Input, InputNumber, Modal, Select, notification } from "antd";
import { useState } from "react";
import { createNewOrder } from "../../services/orderService";
import Cookies from "js-cookie";

function CreateOrder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const userId = Cookies.get("userId");

      const payload = {
        totalAmount: values.totalAmount,
        status: values.status,
        orderItems: [
          {
            bookTitle: values.bookTitle,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
            discount: values.discount || 0,
          },
        ],
      };

      await createNewOrder(payload, userId);
      api["success"]({
        message: "Tạo đơn hàng thành công!",
        duration: 1.5,
      });

      form.resetFields();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      api["error"]({
        message: "Tạo đơn hàng thất bại!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        + Thêm đơn hàng
      </Button>
      <Modal
        title="Tạo đơn hàng mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="bookTitle"
            rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Nhập số lượng!" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Giá đơn vị"
            name="unitPrice"
            rules={[{ required: true, message: "Nhập giá!" }]}
          >
            <InputNumber min={1000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Giảm giá (%)" name="discount">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Tổng tiền"
            name="totalAmount"
            rules={[{ required: true, message: "Nhập tổng tiền!" }]}
          >
            <InputNumber min={1000} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Chọn trạng thái!" }]}
          >
            <Select
              options={[
                { label: "Đang xử lý", value: "UNPROCESSED" },
                { label: "Hoàn thành", value: "COMPLETED" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CreateOrder;