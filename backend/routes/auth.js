
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, organizationId, role } = req.body;

    // Проверка, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Создание нового пользователя
    const user = new User({
      email,
      firstName,
      lastName,
      password,
      organizationId,
      role: role || 'viewer' // По умолчанию роль 'viewer'
    });

    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration'
    });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed. User not found.'
      });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed. Invalid password.'
      });
    }

    // Обновление даты последнего входа
    user.lastLogin = new Date();
    await user.save();

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          organizationId: user.organizationId
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
});

// Получение профиля пользователя
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed. Invalid token.'
    });
  }
});

// Обновление профиля пользователя
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { firstName, lastName, department, avatar } = req.body;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Обновление полей пользователя
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (department) user.department = department;
    if (avatar) user.avatar = avatar;
    
    user.updatedAt = new Date();
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating profile'
    });
  }
});

// Обновление пароля пользователя
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Проверка текущего пароля
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Обновление пароля
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while changing password'
    });
  }
});

// Обновление токена
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Верификация refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Создание нового JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      status: 'success',
      data: { token }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token'
    });
  }
});

module.exports = router;
