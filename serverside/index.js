require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authModel = require('./DB-Models/auth');
const departmentRoutes = require('./Route/departmentRoute');
const employeeRoutes = require('./Route/EmployeesRoute');
const departmentHeadRoutes = require('./Route/DepartHeadRoute');

// ---------------------------------------------------------------------------
// Environment / config
// ---------------------------------------------------------------------------
const {
  PORT = 5001,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV = 'development',
  CLIENT_URLS = 'http://localhost:3000',
} = process.env;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not set. Add it to your .env file.');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Add it to your .env file — never use a fallback in code.');
}

const allowedOrigins = CLIENT_URLS.split(',').map(url => url.trim());
const isProduction = NODE_ENV === 'production';

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------
const app = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and whitelisted origins only
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ---------------------------------------------------------------------------
// Database connection
// ---------------------------------------------------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction, // requires HTTPS in production
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day, matches JWT expiry
};

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
const verifyAdmin = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Authentication token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
    }
    if (decoded.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  });
};

// ---------------------------------------------------------------------------
// Feature routes
// ---------------------------------------------------------------------------
app.use('/api/department', departmentRoutes);
app.use('/api/departmentHead', departmentHeadRoutes);
app.use('/api/employee', employeeRoutes);

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------
app.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email and password are required' });
    }

    const existing = await authModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({ status: 'success' });
  }),
);

app.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    const admin = await authModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Account not found' });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      return res.status(401).json({ status: 'error', message: 'Incorrect password' });
    }

    const token = jwt.sign({ email: admin.email, role: admin.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);
    return res.json({ status: 'success', role: admin.role, name: admin.name });
  }),
);

app.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ status: 'success' });
});

app.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ status: 'success', message: 'Dashboard access granted' });
});

app.get(
  '/showall',
  asyncHandler(async (req, res) => {
    const admins = await authModel.find({}, 'name email role');
    return res.json({ status: 'success', data: admins });
  }),
);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ---------------------------------------------------------------------------
// Centralized error handler
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    status: 'error',
    message: isProduction ? 'Internal server error' : err.message,
  });
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;