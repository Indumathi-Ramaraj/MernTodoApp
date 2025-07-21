const EmployeeModel = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const existing = await EmployeeModel.findOne({ email });

  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = await EmployeeModel.create({
    name,
    email,
    password,
    phone_number: phoneNumber,
  });
  const { _id } = user;
  res.json({ message: "success", user: { id: _id, name, email, phoneNumber } });
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  // Swagger OAuth2 sends "username"
  const userEmail = email || username;

  if (!userEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await EmployeeModel.findOne({ email: userEmail });

  if (!user || !user.authenticate(password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000,
  });

  res.json({
    message: "success",

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
      token,
    },
  });
};
