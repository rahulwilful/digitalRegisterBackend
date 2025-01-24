const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ValidateToken = require('../middleWare/validateToken');
const { testQuantityAPI, addQuantityUnit, getAllQuantityUnit, getQuantityUnitById, getQuantityUnitByName, updateQuantityUnit, deleteQuantityUnit, restoreQuantityUnit } = require('../controllers/quantityUnit');

//@desc Test Quantity Unit API
//@route GET /api/v1/quantity_unit
//@access Public
router.get('/', testQuantityAPI);

//@desc Add Quantity Unit API
//@route POST /api/v1/quantity_unit
//@access Private
router.post('/add', [body('name', 'Enter a valid name').isLength({ min: 1 })], addQuantityUnit);

//@desc Get All Quantity Unit API
//@route GET /api/v1/quantity_unit/getall
//@access Private
router.get('/getall', getAllQuantityUnit);

//@desc Get Quantity Unit By Id API
//@route GET /api/v1/quantity_unit/:id
//@access Private
router.get('/get/:id', getQuantityUnitById);

//@desc Get Quantity Unit By Name API
//@route POST /api/v1/quantity_unit/get/by/name
//@access Private
router.post('/get/by/name', [body('name', 'Enter a valid name').isLength({ min: 1 })], getQuantityUnitByName);

//@desc Update Quantity Unit API
//@route PUT /api/v1/quantity_unit/:id
//@access Private
router.put('/update/:id', [body('name', 'Enter a valid name').isLength({ min: 1 })], updateQuantityUnit);

//@desc Delete Quantity Unit API
//@route DELETE /api/v1/quantity_unit/delete/:id
//@access Private
router.delete('/delete/:id', deleteQuantityUnit);

//@desc Restore Quantity Unit API
//@route PUT /api/v1/quantity_unit/restore/:id
//@access Private
router.put('/restore/:id', restoreQuantityUnit);

module.exports = router;
