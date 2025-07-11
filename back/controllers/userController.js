const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = process.env;

// Middleware to verify JWT
exports.verifyToken = (req, res, next) => {
  token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');
  token = token.slice(7);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.userId = decoded.id;
    next();
  });
};

// Helper to send email
async function sendPasswordEmail(email, password) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your Account Password',
    text: `Welcome! Your generated password is: ${password}`,
  });
}

// CRUD operations
exports.createUser = async (req, res) => {
  try {
    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const { password, ...otherData } = req.body;

    // Hash the random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user with hashed random password
    const user = await User.create({ ...otherData, password: hashedPassword });

    // Send email with the password
    await sendPasswordEmail(user.email, randomPassword);

    // Optionally, return the plain password to the client (for initial communication)
    res.status(201).json({ ...user.toJSON(), plainPassword: randomPassword });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Print the JWT token as an error in the terminal
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ message: 'Login successful', token, role: user.role,id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Validate request data
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await user.update({ password: hashedNewPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Get all etudiants (id, nom, prenom)
exports.getEtudiants = async (req, res) => {
  console.log('getEtudiants controller called');
  try {
    const etudiants = await User.findAll({
      where: { role: 'etudiant' },
    });
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all encadrants (id, nom, prenom)
exports.getEncadrants = async (req, res) => {
  console.log('getEncadrants controller called');
  try {
    const encadrants = await User.findAll({
      where: { role: 'encadrant' },
    });
    console.log('Fetched encadrants:', encadrants);
    res.status(200).json(encadrants);
  } catch (error) {
    console.error('Error in getEncadrants:', error);
    res.status(400).json({ error: error.message });
  }
};
