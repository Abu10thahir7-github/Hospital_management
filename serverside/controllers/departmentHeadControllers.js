const depHeadModel = require('../DB-Models/depHead');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
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


const DepartHeadAdd = async (req, res) => {
    try {
        const { name, email, age, description, departmentOption } = req.body;
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const image = req.file.filename;
        const department = await depHeadModel.create({ name, email, age, description, departmentOption, image});
        console.log("Added a new Department  Head", department);
        res.status(201).send(department);
    } catch (error) {
        res.status(500).send('Error adding department head');
        console.error('Error adding department head:', error);
    }
};


const getAllDepartHead = async (req, res) => {
    try {
        const depart = await depHeadModel.find();
        const departHeadWithImages = depart.map(depart => {
            const imagePath = depart.image ? `http://localhost:5000/images/${depart.image}` : null;
            console.log('HEAD'+imagePath);
            return { ...depart.toObject(), image: imagePath };
        });
        res.json(departHeadWithImages);
        console.log(deleteDepartHead);
    } catch (error) {
        res.status(404).send('Error fetching departments head');
        console.error('Error fetching departments: head', error);
    }
};


const getDepartHead = async (req, res) => {

    try {
        const depId = req.params.id;
        const dep = await depHeadModel.findById(depId);
        if (!dep) {
            return res.status(404).json({ message: "dep not found" });
        }
        const imagePath = dep.image ? `http://localhost:5000/images/${dep.image}` : null;
        const depHeadDataWithImage = { ...dep.toObject(), image: imagePath };
        res.json(depHeadDataWithImage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateDepartHead = async (req, res) => {
    const depId = req.params.id;
    const { name,email,age,description,departmentOption} = req.body;
    let image = null;
    
    if (req.file) {
        image = req.file.filename;
    }

    try {
        const dep = await depHeadModel.findById(depId);
        if (!dep) {
            return res.status(404).json({ message: "Department head not found" });
        }

        // Delete old image if a new image is uploaded
        if (image && dep.image) {
            const oldImagePath = path.join('public/images', dep.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update department fields
        dep.name = name;
        dep.email = email;
        dep.age = age;
        dep.description =description;

        dep.departmentOption = departmentOption;
        if (image) {
            dep.image = image;
        }

        const updatedDepHead = await dep.save();
        res.json(updatedDepHead);
        console.log(updatedDepHead);
    } catch (err) {
        res.status(500).json({ message: err.message || "Internal Server Error" });
    }
};

const deleteDepartHead = async (req, res) => {
    try {
        const id = req.params.id;
        const department = await depHeadModel.findByIdAndDelete(id);
        if (!department) {
            return res.status(404).send('Department head not available');
        }
        console.log("Deleted a department head");
        res.send(department);
    } catch (error) {
        res.status(404).send('Error deleting department head');
        console.error('Error deleting department Head:', error);
    }
};

const findDepartHeadByName = async (req, res) => {
    try {
      const { name } = req.query; // Read name from the query parameters
      const departments = await depHeadModel.find({ name: new RegExp(name, 'i') }); // Case-insensitive search
      if (!departments.length) {
        return res.status(404).send('No departments Head found ');
      }
      const departmentsWithImages = departments.map(depart => {
        const imagePath = depart.image ? `http://localhost:5000/images/${depart.image}` : null;
        return { ...depart.toObject(), image: imagePath };
      });
      res.json(departmentsWithImages);
      console.log( 'fdsafasfasdf'+departmentsWithImages);
    } catch (error) {
      res.status(500).send('Error fetching departments');
      console.error('Error fetching departments:', error);
    }
  };

module.exports = { upload, DepartHeadAdd, getAllDepartHead, getDepartHead, updateDepartHead, deleteDepartHead ,findDepartHeadByName};
