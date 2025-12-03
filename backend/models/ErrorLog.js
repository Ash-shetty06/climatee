import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  errorType: {
    type: String,
    required: true,
    enum: ['API_FAILURE', 'DATABASE_ERROR', 'VALIDATION_ERROR', 'SYSTEM_ERROR']
  },
  apiName: String,
  endpoint: String,
  errorMessage: {
    type: String,
    required: true
  },
  errorStack: String,
  requestData: mongoose.Schema.Types.Mixed,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('ErrorLog', errorLogSchema);