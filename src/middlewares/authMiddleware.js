const jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token expired" });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ error: "Invalid token" });
        } else {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      req.user = user;
      next();
    });
  },

  permittedRole: (allowedRoles) => (req, res, next) => {
    const userRole = req.user?.role;

    if (userRole && allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Access denied" });
    }
  },
};
