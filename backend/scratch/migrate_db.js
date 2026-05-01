const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Service = require('../src/models/Service');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/autocare-hub');
    console.log('Connected to MongoDB for migration...');

    // Migrate Users (Mechanics) - Initialize ratingCount
    const User = require('../src/models/User');
    const mechanics = await User.find({ role: 'mechanic' });
    console.log(`Found ${mechanics.length} mechanics to check...`);
    for (const m of mechanics) {
      if (m.ratingCount === undefined) {
        m.ratingCount = m.completedJobs || 0;
        await m.save();
        console.log(`Initialized ratingCount for mechanic: ${m.name}`);
      }
    }

    const priceList = {
      'Oil Change': 50,
      'Brake Repair': 150,
      'Tire Rotation': 40,
      'Engine Diagnostic': 80,
      'Battery Replacement': 120,
      'AC Service': 100,
      'Wheel Alignment': 90,
      'Suspension Work': 200,
      'Transmission Flush': 180,
      'General Maintenance': 75
    };

    const services = await Service.find({});
    console.log(`Found ${services.length} services to check...`);

    for (const service of services) {
      let updated = false;

      // Helper to convert string array to object array
      const convertNotes = (notesArray, defaultAuthorId) => {
        if (!notesArray || notesArray.length === 0) return notesArray;
        return notesArray.map(note => {
          if (typeof note === 'string') {
            return {
              text: note,
              authorId: defaultAuthorId || service.mechanicId,
              timestamp: service.createdAt
            };
          }
          return note;
        });
      };

      // 1. Migrate high-level notes
      const originalNotesLen = service.notes?.length || 0;
      service.notes = convertNotes(service.notes);
      if (originalNotesLen > 0 && typeof service.notes[0] === 'object' && originalNotesLen === service.notes.length) {
         // This is a bit loose but it's a migration script
         updated = true;
      }

      // 2. Migrate pending notes
      service.pendingNotes = convertNotes(service.pendingNotes);

      // 3. Migrate logs
      if (service.logs && service.logs.length > 0) {
        service.logs.forEach(log => {
          // Update log technicianId if missing
          if (!log.technicianId && service.mechanicId) {
            log.technicianId = service.mechanicId;
            updated = true;
          }
          // Update log notes to objects
          log.notes = convertNotes(log.notes, log.technicianId);
        });
        updated = true;
      }

      // 4. Assign cost if missing or 0
      if (!service.cost || service.cost === 0) {
        const types = (service.serviceType || '').split(',').map(t => t.trim());
        let totalCost = 0;
        types.forEach(type => {
          totalCost += priceList[type] || 60;
        });
        service.cost = totalCost;
        updated = true;
      }

      if (updated) {
        await service.save();
        console.log(`Migrated service: ${service._id}`);
      }
    }

    console.log('Migration completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
