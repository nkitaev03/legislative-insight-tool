
const express = require('express');
const router = express.Router();
const Simulation = require('../models/Simulation');
const Risk = require('../models/Risk');

// Получение списка всех симуляций
router.get('/', async (req, res) => {
  try {
    const simulations = await Simulation.find({
      organizationId: req.userData.organizationId
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: simulations
    });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching simulations'
    });
  }
});

// Получение конкретной симуляции
router.get('/:id', async (req, res) => {
  try {
    const simulation = await Simulation.findOne({
      _id: req.params.id,
      organizationId: req.userData.organizationId
    });
    
    if (!simulation) {
      return res.status(404).json({
        status: 'error',
        message: 'Simulation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: simulation
    });
  } catch (error) {
    console.error('Get simulation details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching simulation details'
    });
  }
});

// Создание новой симуляции
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      parameters
    } = req.body;
    
    // Создание новой симуляции
    const simulation = new Simulation({
      name,
      type: type || 'base',
      parameters,
      results: [],
      organizationId: req.userData.organizationId,
      createdBy: req.userData.userId
    });
    
    await simulation.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Simulation created successfully',
      data: simulation
    });
  } catch (error) {
    console.error('Create simulation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating simulation'
    });
  }
});

// Запуск симуляции
router.post('/:id/run', async (req, res) => {
  try {
    const simulationId = req.params.id;
    const { riskIds } = req.body;
    
    // Проверка существования симуляции
    const simulation = await Simulation.findOne({
      _id: simulationId,
      organizationId: req.userData.organizationId
    });
    
    if (!simulation) {
      return res.status(404).json({
        status: 'error',
        message: 'Simulation not found'
      });
    }
    
    // Получение всех рисков для симуляции
    const risks = await Risk.find({
      _id: { $in: riskIds },
      organizationId: req.userData.organizationId
    });
    
    if (risks.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid risks found for simulation'
      });
    }
    
    // Для каждого риска проводим симуляцию
    const simulationResults = [];
    
    for (const risk of risks) {
      // Получаем параметры финансового воздействия
      const { min, max, expected } = risk.financialImpact;
      
      // Определяем количество итераций
      const iterations = simulation.parameters.simulationRuns || 1000;
      
      // Массив для результатов симуляций
      const simulationValues = [];
      
      // Получаем тип распределения
      const distributionType = simulation.parameters.distributionType || 'triangular';
      
      // Проводим симуляцию Monte Carlo
      for (let i = 0; i < iterations; i++) {
        let value;
        
        // Разные типы распределения
        switch (distributionType) {
          case 'normal':
            // Нормальное распределение
            const mean = expected;
            const stdDev = (max - min) / 6; // 99.7% значений в пределах min-max
            let u1 = Math.random();
            let u2 = Math.random();
            let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            value = mean + z0 * stdDev;
            break;
            
          case 'uniform':
            // Равномерное распределение
            value = min + Math.random() * (max - min);
            break;
            
          case 'triangular':
          default:
            // Треугольное распределение
            const mode = expected;
            const f = (mode - min) / (max - min);
            const u = Math.random();
            
            if (u < f) {
              value = min + Math.sqrt(u * (max - min) * (mode - min));
            } else {
              value = max - Math.sqrt((1 - u) * (max - min) * (max - mode));
            }
        }
        
        // Применяем коэффициент стресс-теста, если это стресс-тест
        if (simulation.type === 'stress' && simulation.parameters.stressTestCoefficient) {
          value *= simulation.parameters.stressTestCoefficient;
        }
        
        // Добавляем результат в массив
        simulationValues.push(value);
      }
      
      // Сортируем результаты для вычисления метрик
      simulationValues.sort((a, b) => a - b);
      
      // Вычисляем метрики
      const mean = simulationValues.reduce((sum, val) => sum + val, 0) / simulationValues.length;
      const median = simulationValues[Math.floor(simulationValues.length / 2)];
      const minimum = simulationValues[0];
      const maximum = simulationValues[simulationValues.length - 1];
      
      // Вычисляем перцентили
      const p90Index = Math.ceil(0.9 * simulationValues.length) - 1;
      const p95Index = Math.ceil(0.95 * simulationValues.length) - 1;
      const p99Index = Math.ceil(0.99 * simulationValues.length) - 1;
      
      const percentile90 = simulationValues[p90Index];
      const percentile95 = simulationValues[p95Index];
      const percentile99 = simulationValues[p99Index];
      
      // Создаем результат симуляции
      const result = {
        riskId: risk._id,
        title: risk.title,
        simulations: simulationValues,
        mean,
        median,
        min: minimum,
        max: maximum,
        percentile90,
        percentile95,
        percentile99,
        riskCategory: risk.riskCategory
      };
      
      simulationResults.push(result);
    }
    
    // Обновляем симуляцию с результатами
    simulation.results = simulationResults;
    simulation.updatedAt = new Date();
    await simulation.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Simulation completed successfully',
      data: {
        simulationId: simulation._id,
        results: simulationResults
      }
    });
  } catch (error) {
    console.error('Run simulation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while running simulation'
    });
  }
});

// Сравнение симуляций
router.post('/compare', async (req, res) => {
  try {
    const { simulationIds } = req.body;
    
    if (!simulationIds || !Array.isArray(simulationIds) || simulationIds.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'At least two simulation IDs are required for comparison'
      });
    }
    
    // Получение всех симуляций
    const simulations = await Simulation.find({
      _id: { $in: simulationIds },
      organizationId: req.userData.organizationId
    });
    
    if (simulations.length < 2) {
      return res.status(404).json({
        status: 'error',
        message: 'Could not find enough simulations for comparison'
      });
    }
    
    // Собираем данные для сравнения
    const comparisonData = {
      simulations: simulations.map(sim => ({
        id: sim._id,
        name: sim.name,
        type: sim.type,
        parameters: sim.parameters,
        createdAt: sim.createdAt
      })),
      results: [],
      summary: {}
    };
    
    // Находим все уникальные ID рисков
    const allRiskIds = new Set();
    simulations.forEach(sim => {
      sim.results.forEach(result => {
        allRiskIds.add(result.riskId.toString());
      });
    });
    
    // Для каждого риска собираем результаты из всех симуляций
    for (const riskId of allRiskIds) {
      const riskResults = simulations.map(sim => {
        const result = sim.results.find(r => r.riskId.toString() === riskId);
        return {
          simulationId: sim._id,
          simulationName: sim.name,
          simulationType: sim.type,
          result: result || null
        };
      }).filter(item => item.result !== null);
      
      if (riskResults.length > 0) {
        // Получаем название риска из первого результата
        const riskTitle = riskResults[0].result.title;
        const riskCategory = riskResults[0].result.riskCategory;
        
        comparisonData.results.push({
          riskId,
          title: riskTitle,
          category: riskCategory,
          simulationResults: riskResults.map(item => ({
            simulationId: item.simulationId,
            simulationName: item.simulationName,
            simulationType: item.simulationType,
            mean: item.result.mean,
            median: item.result.median,
            min: item.result.min,
            max: item.result.max,
            percentile95: item.result.percentile95
          }))
        });
      }
    }
    
    // Вычисляем итоговую статистику
    const aggregateBySimulation = {};
    
    simulations.forEach(sim => {
      const results = sim.results;
      
      const totalMean = results.reduce((sum, r) => sum + r.mean, 0);
      const totalMedian = results.reduce((sum, r) => sum + r.median, 0);
      const totalMin = results.reduce((sum, r) => sum + r.min, 0);
      const totalMax = results.reduce((sum, r) => sum + r.max, 0);
      const total95 = results.reduce((sum, r) => sum + r.percentile95, 0);
      
      aggregateBySimulation[sim._id] = {
        name: sim.name,
        type: sim.type,
        totalMean,
        totalMedian,
        totalMin,
        totalMax,
        total95,
        riskCount: results.length
      };
    });
    
    comparisonData.summary = aggregateBySimulation;
    
    res.status(200).json({
      status: 'success',
      data: comparisonData
    });
  } catch (error) {
    console.error('Compare simulations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while comparing simulations'
    });
  }
});

// Получение результатов симуляции
router.get('/:id/results', async (req, res) => {
  try {
    const simulation = await Simulation.findOne({
      _id: req.params.id,
      organizationId: req.userData.organizationId
    });
    
    if (!simulation) {
      return res.status(404).json({
        status: 'error',
        message: 'Simulation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: simulation.results
    });
  } catch (error) {
    console.error('Get simulation results error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching simulation results'
    });
  }
});

module.exports = router;
