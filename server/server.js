const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const authRouter = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const messengerRouter = require("./routes/messengerRoute");

app.use(cookieParser());

app.use(bodyParser.json());

dotenv.config({ path: "./config/config.env" });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((error) => console.log(error));

app.use("/api/messenger", authRouter);
app.use("/api/messenger", messengerRouter);

app.listen(5000, () => {
  console.log("Backend server is running.");
});
