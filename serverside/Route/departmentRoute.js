const express = require('express');
const { upload, addDepartment, getAllDepartments, getDepartment, updateDepartment, deleteDepartment ,findDepartmentsByName} = require('../controllers/departmentControlls');

const router = express.Router();

router.post('/departmentsAdd', upload.single('image'), addDepartment);
router.get('/departmentsGet', getAllDepartments);
router.get('/departmentsGet/:id', getDepartment);
router.put('/departmentsUpdate/:id', upload.single('image'), updateDepartment);
router.delete('/departmentsDelete/:id', deleteDepartment);
router.get('/departments/name', findDepartmentsByName);
module.exports = router;
