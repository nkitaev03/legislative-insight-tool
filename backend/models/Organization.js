
const mongoose = require('mongoose');

const organizationSettingsSchema = new mongoose.Schema({
  riskCategories: [{ type: String }],
  complianceFrameworks: [{ type: String }],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    dailyDigest: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true }
  },
  dataRetentionPeriod: { type: Number, default: 365 } // в днях
});

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  size: { 
    type: String, 
    enum: ['small', 'medium', 'large', 'enterprise'],
    default: 'small'
  },
  subscription: { 
    type: String, 
    enum: ['free', 'basic', 'professional', 'enterprise'],
    default: 'free'
  },
  settings: { type: organizationSettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);
