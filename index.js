import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import user from "./models/user.js";
import orderRoutes from "./routes/orderRoutes.js";

mongoose
  .connect(
    "mongodb+srv://radwa24_db:Radwa%4024%40DB@cluster0.htpra1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB ya 3asaaaaaaaal 🚀🍯🎉😘😘");
  })
  .catch((error) => {
    console.error(
      "Error connecting to MongoDB ya 2amar ya omo bugzzzzzzzz:🍯",
      error
    );
  });
const app = express();

app.use(cors());
app.use(express.json());

// Mount order routes
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
