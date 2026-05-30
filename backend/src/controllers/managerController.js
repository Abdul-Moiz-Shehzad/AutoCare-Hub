const User = require('../models/User');
const Service = require('../models/Service');
const Vehicle = require('../models/Vehicle');
const bcrypt = require('bcryptjs');

// @desc    Create a mechanic account
// @route   POST /api/manager/mechanics
// @access  Private/Manager
const createMechanic = async (req, res) => {
  const { name, email, password, specialization } = req.body;

  if (!name || !email || !password || !specialization) {
    return res.status(400).json({ message: 'Please provide name, email, password and specialization' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const mechanic = await User.create({
      name,
      email,
      password,
      role: 'mechanic',
      specialization,
      activeJobs: 0,
      completedJobs: 0,
      rating: 5.0,
    });

    if (mechanic) {
      res.status(201).json({
        _id: mechanic._id,
        name: mechanic.name,
        email: mechanic.email,
        role: mechanic.role,
        specialization: mechanic.specialization,
      });
    } else {
      res.status(400).json({ message: 'Invalid mechanic data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mechanics
// @route   GET /api/manager/mechanics
// @access  Private/Manager
const getMechanics = async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic' }).select('-password');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/manager/requests
// @access  Private/Manager
const getRequests = async (req, res) => {
  try {
    const requests = await Service.find({})
      .populate('customerId', 'name email')
      .populate('mechanicId', 'name')
      .populate('vehicleId', 'make model year');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a mechanic to a request
// @route   PUT /api/manager/requests/:id/assign
// @access  Private/Manager
const assignMechanic = async (req, res) => {
  const { mechanicId } = req.body;

  if (!mechanicId) {
    return res.status(400).json({ message: 'Mechanic ID is required' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    const mechanic = await User.findById(mechanicId);
    if (!mechanic || mechanic.role !== 'mechanic') {
      return res.status(400).json({ message: 'Invalid mechanic ID' });
    }

    // Update old mechanic active jobs count if it was already assigned
    if (service.mechanicId && service.mechanicId.toString() !== mechanicId) {
       await User.findByIdAndUpdate(service.mechanicId, { $inc: { activeJobs: -1 } });
    }

    // Assign new mechanic and increment active jobs
    if (!service.mechanicId || service.mechanicId.toString() !== mechanicId) {
      service.mechanicId = mechanicId;
      if (service.status === 'pending') {
         service.status = 'in-progress';
      }
      await service.save();
      await User.findByIdAndUpdate(mechanicId, { $inc: { activeJobs: 1 } });
    }

    const updatedService = await Service.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('mechanicId', 'name')
      .populate('vehicleId', 'make model year');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/manager/dashboard-stats
// @access  Private/Manager
const getDashboardStats = async (req, res) => {
  try {
    const totalRequests = await Service.countDocuments();
    const pendingRequests = await Service.countDocuments({ status: 'pending' });
    const inProgressRequests = await Service.countDocuments({ status: 'in-progress' });
    const completedRequests = await Service.countDocuments({ status: 'completed' });
    const activeMechanics = await User.countDocuments({ role: 'mechanic' });

    // Weekly bookings — last 7 days grouped by day name
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentServices = await Service.find({ createdAt: { $gte: sevenDaysAgo } });
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyBookings = dayNames.map(day => ({ day, bookings: 0 }));
    recentServices.forEach(s => {
      const dayIndex = new Date(s.createdAt).getDay();
      weeklyBookings[dayIndex].bookings++;
    });

    // Revenue trend — last 6 months, completed services only
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const completedServices = await Service.find({ status: 'completed', createdAt: { $gte: sixMonthsAgo } });
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap = {};
    completedServices.forEach(s => {
      const month = monthNames[new Date(s.createdAt).getMonth()];
      revenueMap[month] = (revenueMap[month] || 0) + (s.cost || 0);
    });
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = monthNames[d.getMonth()];
      revenueByMonth.push({ month: monthName, revenue: revenueMap[monthName] || 0 });
    }

    // Services by type — count all services grouped by serviceType
    const allServices = await Service.find({}, 'serviceType');
    const typeMap = {};
    allServices.forEach(s => {
      if (s.serviceType) {
        typeMap[s.serviceType] = (typeMap[s.serviceType] || 0) + 1;
      }
    });
    const servicesByType = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    res.json({
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      activeMechanics,
      weeklyBookings,
      revenueByMonth,
      servicesByType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createMechanic,
  getMechanics,
  getRequests,
  assignMechanic,
  getDashboardStats,
};
