// controllers/userController.js
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// GET: All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('blogs', 'title');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET: Single User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('blogs');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// POST: Register User
export const registerUser = async (req, res) => {
  const { name, email, password, img } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      img
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// POST: Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
const jwtSecret = process.env.JWT_SECRET;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1d' }); // replace 'secretKey' in production

    res.status(200).json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// PUT: Update User Info
export const updateUser = async (req, res) => {
  const { name, img } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, img },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// DELETE: Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
