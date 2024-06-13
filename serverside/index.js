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
app.use(cors({ credentials: true, origin: 'https://hospitalmanage.vercel.app/' }));
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

// Database Connection
mongoose.connect('mongodb+srv://abu10thahir7:ZkNsifw1OQAGyo4J@cluster0.yxuqee9.mongodb.net/HospitalManagement', {
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

app.get('/',(req,res)=>{
res.send("server running its abu")
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // password hashing
  bcrypt.hash(password, 10)
      .then(hash => {
          authModel.create({ name, email, password: hash })
              .then(admin => res.json({ status: "succcess" }))
              .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
});
app.post('/login', async (req, res) => {
  const {name, email, password } = req.body;
  console.log(name);
  const admin = await authModel.findOne({ email: email })
      .then(admin => {
          if (admin) {
              bcrypt.compare(password, admin.password, (err, response) => {
                  console.log(password,admin.password);
                  if (response) {
                      const token = jwt.sign({ email: admin.email, role: admin.role }, "jwt-secret-key", { expiresIn: '1d' });
                      res.cookie("token", token);
                      return res.json({ status: "success", role: admin.role , name:admin.name } );
                  } else {
                      return res.status(401).json({ status: "error", message: "Incorrect password" });
       
                  }
              });
          } else {
              return res.status(404).json({ status: "error", message: "admin not found" });
          }
      })
      .catch(err => res.status(500).json({ status: "error", message: "Internal server error" }));
});

;const varifyadmin=(req,res,next)=> {
  const token=req.cookie.token
  if(!token) {
      return res.json("token misssing")
  }else{
      jwt.verify(token,"jwt-secret-key",(err,decoded)=> {
          if(err) {
              return res.json("error on token")
          }else {
              if(jwt.decoded.role==="admin" ) {
                  next()
              }else {
                  return res.json("not admin")
              }
          }
      })
  }
}

app.get('/dashboard',varifyadmin,(req,res)=> {
  res.json( "dashboard success")
  
})


app.get('/showall', (req, res) => {
authModel.find({}, 'name email role')
    .then(admins => res.json(admins))
    .catch(err => console.log(err));
})



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
