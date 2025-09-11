import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  number_of_likes: { type: Number },
});

export default mongoose.model("user", userSchema);
