const Service = require('../models/Service');
const User = require('../models/User');

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Service.find({ mechanicId: req.user._id })
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ['in-progress', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Allowed values: in-progress, completed' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (service.mechanicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const wasCompleted = service.status === 'completed';
    service.status = status;
    await service.save();

    if (status === 'completed' && !wasCompleted) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { completedJobs: 1 },
        $max: { activeJobs: 0 },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { activeJobs: -1 },
      });
    }

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addJobNote = async (req, res) => {
  const { note } = req.body;

  if (!note || note.trim() === '') {
    return res.status(400).json({ message: 'Note cannot be empty' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (service.mechanicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add notes to this job' });
    }

    service.notes.push(note.trim());
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyJobs,
  updateJobStatus,
  addJobNote,
};
