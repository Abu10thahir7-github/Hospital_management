const express = require('express');
const { upload,  employeeAdd, getAllEmployees, getEmployee, Employeupdate, deleteEmploye   } = require('../controllers/employeesControllers');

const router = express.Router();

router.post('/employeAdd', upload.single('image'), employeeAdd);
router.get('/employeGet', getAllEmployees);
router.get('/employeGet/:id', getEmployee);
router.put('/employeUpdate/:id', upload.single('image'), Employeupdate);
router.delete('/employeDelete/:id', deleteEmploye);

module.exports = router;
