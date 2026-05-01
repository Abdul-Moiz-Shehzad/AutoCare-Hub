const Service = require('../models/Service');
const User = require('../models/User');

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Service.find({ 
      $or: [
        { mechanicId: req.user._id },
        { 'logs.technicianId': req.user._id }
      ]
    })
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email phone')
      .populate('logs.technicianId', 'name role')
      .populate('logs.notes.authorId', 'name role')
      .populate('pendingNotes.authorId', 'name role')
      .sort({ updatedAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJobStatus = async (req, res) => {
  const { status, completionImage, milestone } = req.body;

  const allowedStatuses = ['in-progress', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Allowed values: in-progress, completed' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Mechanics set to review-pending when they finish, and provide a photo
    if (status === 'completed') {
      service.status = 'review-pending';

      // Automatically create a final milestone from pending notes if a milestone name is provided
      if (milestone) {
        service.logs.push({
          milestone: milestone.trim(),
          notes: [...service.pendingNotes],
          technicianId: req.user._id,
          image: completionImage || null,
          timestamp: new Date()
        });
        service.pendingNotes = []; // Clear pending notes
      }
    } else {
      service.status = status;
    }
    
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email phone');

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

    // Allow any mechanic to add notes (accountability is handled by authorId)
    service.pendingNotes.push({
      text: note.trim(),
      authorId: req.user._id,
      timestamp: new Date()
    });
    
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email phone')
      .populate('pendingNotes.authorId', 'name role');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addJobMilestone = async (req, res) => {
  const { milestone, image } = req.body;

  if (!milestone || milestone.trim() === '') {
    return res.status(400).json({ message: 'Milestone cannot be empty' });
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Move pending notes to the new log entry
    service.logs.push({
      milestone: milestone.trim(),
      notes: [...service.pendingNotes],
      technicianId: req.user._id,
      image: image || null,
      timestamp: new Date()
    });

    service.pendingNotes = []; // Clear the buffer
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email phone')
      .populate('logs.technicianId', 'name role')
      .populate('logs.notes.authorId', 'name role');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJobLog = async (req, res) => {
  const { logs } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Authorization check: Ensure user only modifies their own logs
    // We'll compare the input logs with existing ones
    const currentUserId = req.user._id.toString();
    
    // Simple logic: if they try to change a log that isn't theirs, block it
    for (let i = 0; i < logs.length; i++) {
        const originalLog = service.logs[i];
        if (originalLog && originalLog.technicianId.toString() !== currentUserId) {
            if (originalLog.milestone !== logs[i].milestone || JSON.stringify(originalLog.notes) !== JSON.stringify(logs[i].notes)) {
                return res.status(403).json({ message: 'You can only edit logs created by yourself' });
            }
        }
    }

    service.logs = logs;
    await service.save();

    const updatedService = await Service.findById(req.params.id)
      .populate('vehicleId', 'make model year plate color')
      .populate('customerId', 'name email phone');

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyJobs,
  updateJobStatus,
  addJobNote,
  addJobMilestone,
  updateJobLog,
};
