const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const bot = require("./telegramBot/bot");

//routes
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todoList");
const telegramRoutes = require("./routes/telegramWebHook");

//app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // swagger
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bot.webhookCallback("/api/telegram/webhook"));

//cors
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8000",
      "https://0603ba759afd.ngrok-free.app",
      "https://80831853cf95.ngrok-free.app",
      "https://mern-todo-backend-88mz.onrender.com",
      "https://mern-todo-app-tan.vercel.app",
    ],
    credentials: true,
  })
);



//db
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

app.use("/api", userRoutes);
app.use("/api", telegramRoutes);
app.use("/api", todoRoutes);

//api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
