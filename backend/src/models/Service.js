const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle',
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  serviceType: {
    type: String,
    required: true,
  },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  customerRating: { type: Number, default: 0 },
  description: {
    type: String,
  },
  notes: [{
    type: String,
  }],
  cost: {
    type: Number,
    default: 0,
  },
  estimatedCompletion: {
    type: Date,
  }
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
