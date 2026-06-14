import connectDB from "~/server/utils/mongoose";
import order from "~/server/models/order";

export default defineEventHandler(async () => {
  await connectDB();
  const orders = await order.find();
  return orders;
});
