const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  plate: { type: String, required: true },
  color: { type: String, required: true },
  vin: { type: String },
  mileage: { type: Number, required: true },
  image: { type: String },
}, {
  timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
