import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../models/User.js';
import { generateToken, verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Register new user
authRouter.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash,
      phone: phone || '',
      role: 'customer',
      address: address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
      },
    });

    const token = generateToken({
      userId: newUser._id || newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
  }
});

// Login
authRouter.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      userId: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...userSafe } = user;
    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
  }
});

// Get current profile
authRouter.get('/me', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }
    const user = await UserRepository.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching user profile.' });
  }
});

// Update profile
authRouter.put('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }

    const { name, phone, address } = req.body;
    const updated = await UserRepository.update(req.user.userId, {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(address ? { address } : {}),
    });

    res.json({ success: true, message: 'Profile updated successfully.', user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating profile.' });
  }
});
