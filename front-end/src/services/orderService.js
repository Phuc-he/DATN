import { get, post, put, del } from "../utils/request";

export const getOrders = async () => {
  const result = await get("orders");
  return result;
};

export const getOrderByUserId = async (userId) => {
  const result = await get(`orders/users/${userId}`);
  return result;
};

export const createNewOrder = async (options, userId) => {
  const result = await post(options, `orders?userId=${userId}`);
  return result;
};

export const updateOrder = async (id, data) => {
  const result = await put(data, `orders/${id}/status`);
  return result;
};

export const delOrder = async (id) => {
  const result = await del(`orders/${id}`);
  return result;
};