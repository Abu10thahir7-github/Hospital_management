const depModel = require("../DB-Models/Departments");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = "public/images";
    fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const addDepartment = async (req, res) => {
  try {
    const { name, year, description } = req.body;
    const image = req.file.filename;
    const department = await depModel.create({
      name,
      year,
      description,
      image,
    });
    console.log("Added a new Department", department);
    res.status(201).send(department);
  } catch (error) {
    res.status(500).send("Error adding department");
    console.error("Error adding department:", error);
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const depart = await depModel.find();
    const departmentWithImages = depart.map((depart) => {
      const imagePath = depart.image
        ? `http://localhost:5001/images/${depart.image}`
        : null;
      console.log("department" + imagePath);
      return { ...depart.toObject(), image: imagePath };
    });
    res.json(departmentWithImages);
  } catch (error) {
    res.status(404).send("Error fetching departments");
    console.error("Error fetching departments:", error);
  }
};

const getDepartment = async (req, res) => {
  try {
    const depId = req.params.id;
    const dep = await depModel.findById(depId);
    if (!dep) {
      return res.status(404).json({ message: "dep not found" });
    }
    const imagePath = dep.image
      ? `http://localhost:5001/images/${dep.image}`
      : null;
    const depDataWithImage = { ...dep.toObject(), image: imagePath };
    res.json(depDataWithImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDepartment = async (req, res) => {
  const depId = req.params.id;
  const { name, year, description } = req.body;
  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  try {
    const dep = await depModel.findById(depId);
    if (!dep) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Delete old image if a new image is uploaded
    if (image && dep.image) {
      const oldImagePath = path.join("public/images", dep.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update department fields
    dep.name = name;
    dep.year = year;
    dep.description = description;
    if (image) {
      dep.image = image;
    }

    const updatedDep = await dep.save();
    res.json(updatedDep);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    const department = await depModel.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).send("Department not available");
    }
    console.log("Deleted a department");
    res.send(department);
  } catch (error) {
    res.status(404).send("Error deleting department");
    console.error("Error deleting department:", error);
  }
};
const findDepartmentsByName = async (req, res) => {
  try {
    const { name } = req.query; // Read name from the query parameters
    const departments = await depModel.find({ name: new RegExp(name, "i") }); // Case-insensitive search
    if (!departments.length) {
      return res.status(404).send("No departments found ");
    }
    const departmentsWithImages = departments.map((depart) => {
      const imagePath = depart.image
        ? `http://localhost:5001/images/${depart.image}`
        : null;
      return { ...depart.toObject(), image: imagePath };
    });
    res.json(departmentsWithImages);
    console.log(departmentsWithImages);
  } catch (error) {
    res.status(500).send("Error fetching departments");
    console.error("Error fetching departments:", error);
  }
};

module.exports = {
  upload,
  addDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  findDepartmentsByName,
};
