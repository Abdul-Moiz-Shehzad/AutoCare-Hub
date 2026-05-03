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
  status: { type: String, enum: ['pending', 'received', 'in-progress', 'review-pending', 'completed', 'picked-up', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  customerRating: { type: Number, default: 0 },
  description: {
    type: String,
  },
  notes: [{
    text: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  }],
  logs: [{
    milestone: { type: String, required: true },
    notes: [{
      text: { type: String, required: true },
      authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
    }],
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: { type: String },
    timestamp: { type: Date, default: Date.now },
  }],
  pendingNotes: [{
    text: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  }],
  cost: {
    type: Number,
    default: 0,
  },
  estimatedCompletion: {
    type: Date,
  },
  scheduledDate: {
    type: String, // Storing as YYYY-MM-DD for easier querying/matching
  },
  scheduledTime: {
    type: String, // HH:mm
  },
  completionImage: {
    type: String,
  }
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
