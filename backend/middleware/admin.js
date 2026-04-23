// Admin authorization middleware
// Must be used AFTER auth middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin', success: false });
  }
};

module.exports = { admin };
