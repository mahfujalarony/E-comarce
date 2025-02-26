const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Problem', error });
  }
};

const makeAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User Not Found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'User Already Admin!' });

    user.role = 'admin';
    await user.save();
    res.status(200).json({ message: 'User promoted to Admin!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to make Admin!', error });
  }
};

const removeAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') return res.status(400).json({ message: 'User Not Admin!' });

    user.role = 'user';
    await user.save();
    res.status(200).json({ message: 'Admin rights removed!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove Admin!', error });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ message: 'User Not Found!' });

    res.status(200).json({ message: 'User Deleted Successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to Delete User!', error });
  }
};

module.exports = { getUsers, makeAdmin, removeAdmin, deleteUser };
