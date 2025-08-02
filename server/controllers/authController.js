const EmployeeModel = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    const emailExists = await EmployeeModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const phoneNumberExists = await EmployeeModel.findOne({ phone_number });
    if (phoneNumberExists) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }

    const newUser = new EmployeeModel({
      name,
      email,
      phone_number: phoneNumber,
      password,
    });

    newUser.password = password;
    await newUser.save();

    return res.status(201).json({
      message: "Signup successful",
      user: {
        name: newUser.name,
        email: newUser.email,
        telegramChatId: newUser.telegramChatId,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
    expiresIn: "1d",
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
      telegramChatId: user.telegramChatId,
      token,
    },
  });
};
