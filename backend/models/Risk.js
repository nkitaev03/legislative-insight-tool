
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  responsible: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

const financialImpactSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  expected: { type: Number, required: true }
});

const riskResponseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  responsible: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const riskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  source: { type: String, required: true },
  sourceUrl: { type: String },
  risk: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  isNew: { type: Boolean, default: true },
  responsible: { type: String },
  risks: [{ type: String }],
  recommendations: [recommendationSchema],
  financialImpact: financialImpactSchema,
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'mitigated', 'accepted'],
    default: 'pending'
  },
  responses: [riskResponseSchema],
  riskCategory: {
    type: String,
    enum: ['financial', 'operational', 'legal', 'strategic', 'reputational']
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Risk', riskSchema);
