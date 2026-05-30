const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');

// @desc    Get all vehicles for current customer
// @route   GET /api/customer/vehicles
// @access  Private/Customer
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ customerId: req.user._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/customer/vehicles
// @access  Private/Customer
const addVehicle = async (req, res) => {
  const { make, model, year, color, plate, mileage, vin, image } = req.body;

  if (!make || !model || !year || !color || !plate || !mileage) {
    return res.status(400).json({ message: 'Please provide make, model, year, color, plate and mileage' });
  }

  try {
    const vehicle = await Vehicle.create({
      customerId: req.user._id,
      make,
      model,
      year,
      color,
      plate,
      mileage,
      vin,
      image: image || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop',
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/customer/vehicles/:id
// @access  Private/Customer
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    // Check if vehicle belongs to customer
    if (vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Prevent deletion if there are in-progress services
    const inProgress = await Service.find({ vehicleId: vehicle._id, status: 'in-progress' });
    if (inProgress.length > 0) {
      return res.status(400).json({ message: 'Cannot delete vehicle. It has a service currently in-progress.' });
    }

    // Delete any pending services associated with this vehicle
    await Service.deleteMany({
      vehicleId: vehicle._id,
      status: 'pending'
    });

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/customer/vehicles/:id
// @access  Private/Customer
const updateVehicle = async (req, res) => {
  const { make, model, year, color, plate, mileage, vin, image } = req.body;

  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    if (vehicle.customerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.color = color || vehicle.color;
    vehicle.plate = plate || vehicle.plate;
    vehicle.mileage = mileage || vehicle.mileage;
    vehicle.vin = vin !== undefined ? vin : vehicle.vin;
    vehicle.image = image || vehicle.image;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all services for current customer
// @route   GET /api/customer/services
// @access  Private/Customer
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ customerId: req.user._id })
      .populate('vehicleId', 'make model year plate')
      .populate('mechanicId', 'name')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a new service
// @route   POST /api/customer/services
// @access  Private/Customer
const bookService = async (req, res) => {
  const { vehicleId, serviceType, description, preferredDate, preferredTime } = req.body;

  if (!vehicleId || !serviceType) {
    return res.status(400).json({ message: 'Vehicle and service type are required' });
  }

  try {
    const service = await Service.create({
      customerId: req.user._id,
      vehicleId,
      serviceType,
      description,
      notes: [`Customer requested on ${preferredDate} at ${preferredTime}`],
      status: 'pending',
      priority: 'medium',
    });

    const populatedService = await Service.findById(service._id).populate('vehicleId');

    res.status(201).json(populatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Rate a completed service
// @route   PUT /api/customer/services/:id/rate
// @access  Private/Customer
const rateService = async (req, res) => {
  const { rating } = req.body;

  const numRating = Number(rating);
  if (rating === undefined || rating === null || isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    if (service.customerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (service.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed services' });
    }

    service.customerRating = numRating;
    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVehicles,
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getServices,
  bookService,
  rateService
};
