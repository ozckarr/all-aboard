import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
