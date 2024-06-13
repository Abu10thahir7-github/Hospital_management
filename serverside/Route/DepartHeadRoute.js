const express = require('express');
const { upload, DepartHeadAdd, findDepartHeadByName,getAllDepartHead, getDepartHead, updateDepartHead, deleteDepartHead  } = require('../controllers/departmentHeadControllers');

const router = express.Router();

router.post('/HeadAdd', upload.single('image'), DepartHeadAdd);
router.get('/HeadGet', getAllDepartHead);
router.get('/HeadGet/:id', getDepartHead);
router.put('/HeadUpdate/:id', upload.single('image'), updateDepartHead);
router.delete('/HeadDelete/:id', deleteDepartHead);
router.get('/departHead/name', findDepartHeadByName);
module.exports = router;
