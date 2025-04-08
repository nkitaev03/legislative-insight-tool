
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение маршрутов API
const authRoutes = require('./routes/auth');
const riskRoutes = require('./routes/risks');
const legislationRoutes = require('./routes/legislation');
const newsRoutes = require('./routes/news');
const simulationRoutes = require('./routes/simulations');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const organizationRoutes = require('./routes/organization');

// Аутентификация middleware
const authMiddleware = require('./middleware/auth');

// Использование маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/risks', authMiddleware, riskRoutes);
app.use('/api/legislation', authMiddleware, legislationRoutes);
app.use('/api/news', authMiddleware, newsRoutes);
app.use('/api/simulations', authMiddleware, simulationRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/organization', authMiddleware, organizationRoutes);

// Базовый маршрут для проверки работоспособности API
app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Запуск сервера после успешного подключения к БД
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
