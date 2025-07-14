const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();

//routes
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todoList");

//app
const app = express();

//middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // swagger
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: process.env.CLIENT_URL }));
}

//db
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

app.use("/api", userRoutes);
app.use("/api", todoRoutes);

//api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("server is running");
});
