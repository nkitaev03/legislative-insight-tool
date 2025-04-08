
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Authentication failed. No token provided.' });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Authentication failed. Invalid token.' });
  }
};
