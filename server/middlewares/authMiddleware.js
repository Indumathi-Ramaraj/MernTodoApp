const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(417).json({ error: "Token expired" }); // Custom 417
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
