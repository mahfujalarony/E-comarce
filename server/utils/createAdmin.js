const User = require('../models/userModel'); // ইউজার মডেল ইমপোর্ট করো

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultAdmin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin'
      });

      await defaultAdmin.save();
      console.log('✅ Default admin created successfully!');
    } else {
      console.log('✅ Admin already exists. Skipping admin creation.');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

module.exports = createDefaultAdmin;
