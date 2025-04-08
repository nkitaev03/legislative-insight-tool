
const express = require('express');
const router = express.Router();
const Risk = require('../models/Risk');
const mongoose = require('mongoose');

// Получение списка всех рисков с пагинацией и фильтрацией
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      category, 
      severity, 
      dateFrom, 
      dateTo, 
      responsible, 
      status 
    } = req.query;
    
    // Построение фильтра на основе параметров запроса
    const filter = { organizationId: req.userData.organizationId };
    
    if (category) {
      filter.riskCategory = Array.isArray(category) ? { $in: category } : category;
    }
    
    if (severity) {
      filter.risk = Array.isArray(severity) ? { $in: severity } : severity;
    }
    
    if (responsible) {
      filter.responsible = Array.isArray(responsible) ? { $in: responsible } : responsible;
    }
    
    if (status) {
      filter.status = Array.isArray(status) ? { $in: status } : status;
    }
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    
    // Подсчет общего количества документов
    const totalItems = await Risk.countDocuments(filter);
    
    // Получение рисков с применением пагинации
    const risks = await Risk.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));
    
    res.status(200).json({
      status: 'success',
      data: risks,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    });
  } catch (error) {
    console.error('Get risks error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching risks'
    });
  }
});

// Получение деталей конкретного риска
router.get('/:id', async (req, res) => {
  try {
    const risk = await Risk.findOne({
      _id: req.params.id,
      organizationId: req.userData.organizationId
    });
    
    if (!risk) {
      return res.status(404).json({
        status: 'error',
        message: 'Risk not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: risk
    });
  } catch (error) {
    console.error('Get risk details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching risk details'
    });
  }
});

// Создание нового риска
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      source,
      sourceUrl,
      risk: riskSeverity,
      responsible,
      risks,
      recommendations,
      financialImpact,
      riskCategory,
      status
    } = req.body;
    
    // Создание нового риска
    const risk = new Risk({
      title,
      description,
      category,
      date: new Date(date),
      source,
      sourceUrl,
      risk: riskSeverity,
      isNew: true,
      responsible,
      risks: risks || [],
      recommendations: recommendations || [],
      financialImpact,
      riskCategory,
      status: status || 'pending',
      organizationId: req.userData.organizationId,
      createdBy: req.userData.userId
    });
    
    await risk.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Risk created successfully',
      data: risk
    });
  } catch (error) {
    console.error('Create risk error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating risk'
    });
  }
});

// Обновление существующего риска
router.put('/:id', async (req, res) => {
  try {
    const riskId = req.params.id;
    
    // Проверка существования риска
    const existingRisk = await Risk.findOne({
      _id: riskId,
      organizationId: req.userData.organizationId
    });
    
    if (!existingRisk) {
      return res.status(404).json({
        status: 'error',
        message: 'Risk not found'
      });
    }
    
    // Обновление полей риска
    const updateData = { ...req.body };
    
    // Преобразование даты, если она предоставлена
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    
    updateData.lastUpdated = new Date();
    updateData.isNew = false;
    
    // Обновление риска в базе данных
    const updatedRisk = await Risk.findByIdAndUpdate(
      riskId,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Risk updated successfully',
      data: updatedRisk
    });
  } catch (error) {
    console.error('Update risk error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating risk'
    });
  }
});

// Удаление риска
router.delete('/:id', async (req, res) => {
  try {
    const riskId = req.params.id;
    
    // Проверка существования риска
    const existingRisk = await Risk.findOne({
      _id: riskId,
      organizationId: req.userData.organizationId
    });
    
    if (!existingRisk) {
      return res.status(404).json({
        status: 'error',
        message: 'Risk not found'
      });
    }
    
    // Проверка прав доступа (только администраторы могут удалять риски)
    if (req.userData.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete risks'
      });
    }
    
    // Удаление риска
    await Risk.findByIdAndDelete(riskId);
    
    res.status(200).json({
      status: 'success',
      message: 'Risk deleted successfully'
    });
  } catch (error) {
    console.error('Delete risk error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting risk'
    });
  }
});

// Добавление ответа на риск
router.post('/:id/responses', async (req, res) => {
  try {
    const riskId = req.params.id;
    const { title, description, responsible, status, dueDate } = req.body;
    
    // Проверка существования риска
    const risk = await Risk.findOne({
      _id: riskId,
      organizationId: req.userData.organizationId
    });
    
    if (!risk) {
      return res.status(404).json({
        status: 'error',
        message: 'Risk not found'
      });
    }
    
    // Создание нового ответа
    const response = {
      title,
      description,
      responsible,
      status: status || 'pending',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Добавление ответа к риску
    risk.responses.push(response);
    risk.lastUpdated = new Date();
    await risk.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Response added successfully',
      data: response
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while adding response'
    });
  }
});

// Получение статистики по рискам
router.get('/statistics/summary', async (req, res) => {
  try {
    // Агрегация рисков по категориям
    const categoryCounts = await Risk.aggregate([
      { $match: { organizationId: mongoose.Types.ObjectId(req.userData.organizationId) } },
      { $group: { _id: '$riskCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Агрегация рисков по уровням риска
    const severityCounts = await Risk.aggregate([
      { $match: { organizationId: mongoose.Types.ObjectId(req.userData.organizationId) } },
      { $group: { _id: '$risk', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Агрегация рисков по статусам
    const statusCounts = await Risk.aggregate([
      { $match: { organizationId: mongoose.Types.ObjectId(req.userData.organizationId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Статистика по временным рамкам (последние N месяцев)
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    
    const monthlyRisks = await Risk.aggregate([
      { 
        $match: { 
          organizationId: mongoose.Types.ObjectId(req.userData.organizationId),
          date: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        categories: categoryCounts,
        severities: severityCounts,
        statuses: statusCounts,
        monthlyTrends: monthlyRisks
      }
    });
  } catch (error) {
    console.error('Risk statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching risk statistics'
    });
  }
});

module.exports = router;
