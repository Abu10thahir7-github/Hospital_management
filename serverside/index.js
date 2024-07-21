const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('./DB-Models/auth');
const departmentRoutes = require('./Route/departmentRoute');
const EmployeesRoutes = require('./Route/EmployeesRoute');
const DepartmentHeadRoutes = require('./Route/DepartHeadRoute');

const app = express();

// Middleware
app.use(cors({
  credentials: true,
  origin: ["https://hospitalmanage.vercel.app", "http://localhost:3000"]
}));
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database Connection
mongoose.connect('mongodb://localhost:27017/Hospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Routes
app.use('/api/department', departmentRoutes);
app.use('/api/departmentHead', DepartmentHeadRoutes);
app.use('/api/employee', EmployeesRoutes);

// Registration Route
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      authModel.create({ name, email, password: hash })
        .then(admin => res.json({ status: "success" }))
        .catch(err => {
          console.error(err);
          res.status(500).json({ status: "error", message: "Internal server error" });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    });
});

// Login Route
app.post('/login', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = await authModel.findOne({ email: email });
    if (admin) {
      const response = await bcrypt.compare(password, admin.password);
      if (response) {
        const token = jwt.sign({ email: admin.email, role: admin.role }, process.env.JWT_SECRET || "jwt-secret-key", { expiresIn: '1d' });
        res.cookie("token", token);
        return res.json({ status: "success", role: admin.role, name: admin.name });
      } else {
        return res.status(401).json({ status: "error", message: "Incorrect password" });
      }
    } else {
      return res.status(404).json({ status: "error", message: "admin not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Verify Admin Middleware
const verifyadmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET || "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Error on token" });
      } else {
        if (decoded.role === "admin") {
          next();
        } else {
          return res.status(403).json({ message: "Not admin" });
        }
      }
    });
  }
}

// Protected Route
app.get('/dashboard', verifyadmin, (req, res) => {
  res.json("Dashboard success");
});

// Show All Admins Route
app.get('/showall', (req, res) => {
  authModel.find({}, 'name email role')
    .then(admins => res.json(admins))
    .catch(err => {
      console.error(err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
