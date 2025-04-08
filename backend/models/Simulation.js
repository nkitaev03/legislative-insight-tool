
const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  riskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Risk',
    required: true
  },
  title: { type: String, required: true },
  simulations: [{ type: Number }],
  mean: { type: Number, required: true },
  median: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  percentile90: { type: Number, required: true },
  percentile95: { type: Number, required: true },
  percentile99: { type: Number },
  riskCategory: { 
    type: String,
    enum: ['financial', 'operational', 'legal', 'strategic', 'reputational'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const simulationScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['base', 'stress', 'custom'],
    default: 'base'
  },
  results: [simulationResultSchema],
  parameters: {
    simulationRuns: { type: Number, required: true },
    confidenceLevel: { type: Number, required: true },
    distributionType: { type: String, required: true },
    stressTestCoefficient: { type: Number },
    includeCorrelations: { type: Boolean, default: false }
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', simulationScenarioSchema);
