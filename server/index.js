import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import UploadRoute from "./routes/UploadRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import GroupRoute from "./routes/GroupRoute.js";
import MessageRoute from "./routes/MessageRoute.js";

const app = express();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static("public"));
app.use("/api/images", express.static("images"));

dotenv.config();
const port = process.env.PORT || 5000;

const CONNECTION = process.env.MONGO_STR;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Listening at Port ${port}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/upload", UploadRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/group", GroupRoute);
app.use("/api/message", MessageRoute);
