import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(5000, () => {
  console.log("Server listening on port 3000");
});

app.use("/api/user", userRoutes);
