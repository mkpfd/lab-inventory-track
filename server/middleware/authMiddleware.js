const jwt = require("jsonwebtoken");

// checks the JWT sent by the client on protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided, please login" });
  }

  const token = authHeader.split(" ")[1]; // header looks like "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "No token provided, please login" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// wrap this with the roles that are allowed, e.g. checkRole(["labmanager"])
const checkRole = (allowedRoles) => (req, res, next) => {
  if (req.user.role !== "admin" && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to do this" });
  }
  next();
};

module.exports = { verifyToken, checkRole };
