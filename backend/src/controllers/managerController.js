const User = require('../models/User');
const Service = require('../models/Service');
const Vehicle = require('../models/Vehicle');
const bcrypt = require('bcryptjs');

// @desc    Create a mechanic account
// @route   POST /api/manager/mechanics
// @access  Private/Manager
const createMechanic = async (req, res) => {
  const { name, email, phone, password, specialization } = req.body;

  if (!name || !email || !phone || !password || !specialization) {
    return res.status(400).json({ message: 'Please provide name, email, phone, password and specialization' });
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
      phone,
      password,
      role: 'mechanic',
      specialization,
      activeJobs: 0,
      completedJobs: 0,
      rating: 5.0,
      managerId: req.user._id,
    });

    if (mechanic) {
      res.status(201).json({
        _id: mechanic._id,
        name: mechanic.name,
        email: mechanic.email,
        phone: mechanic.phone,
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
    // Find mechanics assigned to this manager OR mechanics with no manager assigned (legacy/unassigned)
    const mechanics = await User.find({ 
      role: 'mechanic', 
      $or: [
        { managerId: req.user._id },
        { managerId: { $exists: false } },
        { managerId: null }
      ]
    }).select('-password');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mechanic account
// @route   DELETE /api/manager/mechanics/:id
// @access  Private/Manager
const deleteMechanic = async (req, res) => {
  try {
    const mechanic = await User.findById(req.params.id);

    if (!mechanic || mechanic.role !== 'mechanic') {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    // Unassign services linked to the deleted mechanic
    await Service.updateMany(
      { mechanicId: mechanic._id, status: { $ne: 'completed' } },
      { $set: { mechanicId: null, status: 'pending' } }
    );
    await Service.updateMany(
      { mechanicId: mechanic._id, status: 'completed' },
      { $set: { mechanicId: null } }
    );

    await User.findByIdAndDelete(mechanic._id);
    res.json({ message: 'Mechanic account deleted successfully' });
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
      .populate('customerId', 'name email phone')
      .populate('mechanicId', 'name phone')
      .populate('vehicleId', 'make model year plate color')
      .populate('logs.technicianId', 'name role')
      .populate('logs.notes.authorId', 'name role')
      .populate('pendingNotes.authorId', 'name role')
      .populate('notes.authorId', 'name role');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign a mechanic to a request
// @route   PUT /api/manager/requests/:id/assign
// @access  Private/Manager
const assignMechanic = async (req, res) => {
  const { mechanicId, note } = req.body;

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
      if (['pending', 'review-pending'].includes(service.status)) {
         service.status = 'in-progress';
      }
      // Add manager instruction note if provided
      if (note && note.trim()) {
        service.notes.push({
          text: `[Manager Instruction] ${note.trim()}`,
          authorId: req.user._id,
          timestamp: new Date(),
        });
      }
      await service.save();
      await User.findByIdAndUpdate(mechanicId, { $inc: { activeJobs: 1 } });
    }

    const updatedService = await Service.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('mechanicId', 'name phone')
      .populate('vehicleId', 'make model year')
      .populate('notes.authorId', 'name role');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service priority
// @route   PUT /api/manager/requests/:id/priority
// @access  Private/Manager
const updateServicePriority = async (req, res) => {
  const { priority } = req.body;

  if (!priority || !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    return res.status(400).json({ message: 'Valid priority is required (low, medium, high, urgent)' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    service.priority = priority;
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('mechanicId', 'name phone')
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
    const reviewPendingRequests = await Service.countDocuments({ status: 'review-pending' });
    const completedRequests = await Service.countDocuments({ status: { $in: ['completed', 'picked-up'] } });
    const activeMechanics = await User.countDocuments({ role: 'mechanic' });

    // Weekly Forecast — Today + next 6 days based on scheduledDate
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      forecast.push({ day: dayName, date: dateStr, bookings: 0 });
    }

    const upcomingServices = await Service.find({ 
      scheduledDate: { $in: forecast.map(f => f.date) } 
    });

    upcomingServices.forEach(s => {
      const f = forecast.find(item => item.date === s.scheduledDate);
      if (f) f.bookings++;
    });

    const weeklyBookings = forecast.map(f => ({ day: f.day, bookings: f.bookings }));

    // Revenue trend — Grouped by Quarters (Q1, Q2, Q3, Q4) for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const pickedUpServices = await Service.find({ 
      status: 'picked-up', 
      createdAt: { $gte: startOfYear } 
    });

    const quarterlyRevenue = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };
    pickedUpServices.forEach(s => {
      const month = new Date(s.createdAt).getMonth();
      const quarter = `Q${Math.floor(month / 3) + 1}`;
      quarterlyRevenue[quarter] += (s.cost || 0);
    });

    const revenueByMonth = Object.entries(quarterlyRevenue).map(([quarter, revenue]) => ({
      month: quarter, // Keeping key as 'month' for frontend compatibility or changing to 'quarter'
      revenue
    }));

    // Services by type — count all services grouped by serviceType (split by comma)
    const allServices = await Service.find({}, 'serviceType');
    const typeMap = {};
    allServices.forEach(s => {
      if (s.serviceType) {
        const types = s.serviceType.split(',').map(t => t.trim()).filter(t => t);
        types.forEach(type => {
          typeMap[type] = (typeMap[type] || 0) + 1;
        });
      }
    });
    const servicesByType = Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    res.json({
      totalRequests,
      pendingRequests,
      inProgressRequests,
      reviewPendingRequests,
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

// @desc    Review a service (Approve/Complete or Send back to mechanic)
// @route   PUT /api/manager/requests/:id/review
// @access  Private/Manager
const reviewServiceRequest = async (req, res) => {
  const { decision } = req.body; // 'approve' or 'reject'

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (decision === 'approve') {
      const wasCompleted = service.status === 'completed';
      service.status = 'completed';
      await service.save();

      // Update mechanic stats if transitioning to completed
      if (!wasCompleted && service.mechanicId) {
        await User.findByIdAndUpdate(service.mechanicId, {
          $inc: { activeJobs: -1, completedJobs: 1 },
        });
        await User.findByIdAndUpdate(service.mechanicId, {
          $max: { activeJobs: 0 },
        });
      }
    } else if (decision === 'reject' || decision === 'redo') {
      service.status = 'in-progress';
      await service.save();
    } else {
      return res.status(400).json({ message: 'Invalid decision. Use "approve" or "redo".' });
    }

    const updatedService = await Service.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('mechanicId', 'name phone')
      .populate('vehicleId', 'make model year plate color');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark car as picked up by owner
// @route   PUT /api/manager/requests/:id/pickup
// @access  Private/Manager
const markAsPickedUp = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    if (service.status !== 'completed') {
      return res.status(400).json({ message: 'Car must be marked as completed before pickup' });
    }

    service.status = 'picked-up';
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('mechanicId', 'name phone')
      .populate('vehicleId', 'make model year plate color');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const markAsReceived = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    if (service.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be marked as received' });
    }

    service.status = 'received';
    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMechanic,
  getMechanics,
  deleteMechanic,
  getRequests,
  assignMechanic,
  updateServicePriority,
  getDashboardStats,
  reviewServiceRequest,
  markAsReceived,
  markAsPickedUp,
};
