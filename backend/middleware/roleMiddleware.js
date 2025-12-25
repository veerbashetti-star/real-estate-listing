const roleMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient role' });
    }
    next();
  };
};

module.exports = roleMiddleware;
