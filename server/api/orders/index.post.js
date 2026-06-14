import connectDB from "~/server/utils/mongoose";
import order from "~/server/models/order";
export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  const postOrder = await order.create({
    productName: body.productName,
    quantity: body.quantity,
    price: body.price,
    status: body.status,
  });

  return postOrder;
});
