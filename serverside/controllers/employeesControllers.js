const employeesModel = require('../DB-Models/Employees');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderPath = 'public/images';
        fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});


const employeeAdd = async (req, res) => {
    try {
        const { name, email, age, description, departmentOption ,reportTo } = req.body;
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const image = req.file.filename;
        const Employeeadd = await employeesModel.create({ name, email, age, description, departmentOption ,reportTo, image});
        console.log("Added a new employee  ", Employeeadd);
        res.status(201).send(Employeeadd);
    } catch (error) {
        res.status(500).send('Error adding employee ');
        console.error('Error adding employee :', error);
    }
};


const getAllEmployees = async (req, res) => {
    try {
        const employeesGet = await employeesModel.find();
        const EmployeWithImages = employeesGet.map(employ => {
            const imagePath = employ.image ? `http://localhost:5000/images/${employ.image}` : null;
            console.log(''+imagePath);
            return { ...employ.toObject(), image: imagePath };
        });
        res.json(EmployeWithImages);
    } catch (error) {
        res.status(404).send('Error fetching employees ');
        console.error('Error fetching employees: ', error);
    }
};


const getEmployee = async (req, res) => {

    try {
        const emplyId = req.params.id;
        const UpdateEmployee = await employeesModel.findById(emplyId);
        if (!UpdateEmployee) {
            return res.status(404).json({ message: "UpdateEmployee not found" });
        }
        const imagePath = UpdateEmployee.image ? `http://localhost:5000/images/${UpdateEmployee.image}` : null;
        const EmployeDataWithImage = { ...UpdateEmployee.toObject(), image: imagePath };
        res.json(EmployeDataWithImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const Employeupdate = async (req, res) => {
    const emplyId = req.params.id;
    const { name,email,age,description,departmentOption ,reportTo} = req.body;
    let image = null;
    
    if (req.file) {
        image = req.file.filename;
    }

    try {
        const UpdateEmployee = await employeesModel.findById(emplyId);
        if (!UpdateEmployee) {
            return res.status(404).json({ message: "employee  not found" });
        }

        // Delete old image if a new image is uploaded
        if (image && UpdateEmployee.image) {
            const oldImagePath = path.join('public/images', UpdateEmployee.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update employee fields
        UpdateEmployee.name = name;
        UpdateEmployee.email = email;
        UpdateEmployee.age = age;
        UpdateEmployee.description =description;

        UpdateEmployee.departmentOption = departmentOption;
        UpdateEmployee.reportTo = reportTo;
        if (image) {
            UpdateEmployee.image = image;
        }

        const updatedEmploye = await UpdateEmployee.save();
        res.json(updatedEmploye);
        console.log("Employe UPDATE"+updatedEmploye);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};

const deleteEmploye = async (req, res) => {
    try {
        const id = req.params.id;
        const employeeDelete = await employeesModel.findByIdAndDelete(id);
        if (!employeeDelete) {
            return res.status(404).send('employee  not available');
        }
        console.log("Deleted a employee ");
        res.send(employeeDelete);
    } catch (error) {
        res.status(404).send('Error deleting employee ');
        console.error('Error deleting employee :', error);
    }
};

module.exports = { upload, employeeAdd, getAllEmployees, getEmployee, Employeupdate, deleteEmploye };
