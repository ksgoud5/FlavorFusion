// backend/middleware/adminMiddleware.js
import User from "../models/User.js";

// This runs AFTER "protect" (so req.user.id already exists from a valid JWT).
// It does one extra check: is this specific user flagged as an admin in the DB?
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error.message);
    res.status(500).json({ message: "Server error verifying admin access" });
  }
};

export default adminOnly;