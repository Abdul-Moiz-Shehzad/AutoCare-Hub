const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
require('dotenv').config({ path: './backend/.env' });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const usersWithoutPhone = await User.find({ phone: { $exists: false } });
    console.log(`Found ${usersWithoutPhone.length} users without phone field.`);
    usersWithoutPhone.forEach(u => console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`));

    const usersWithEmptyPhone = await User.find({ phone: '' });
    console.log(`Found ${usersWithEmptyPhone.length} users with empty phone field.`);
    usersWithEmptyPhone.forEach(u => console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUsers();
