import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.models.order || mongoose.model("order", OrderSchema);
