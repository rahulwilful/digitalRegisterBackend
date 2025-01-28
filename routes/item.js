const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { testItemAPI, addItem, updateItem, updateQuantityUnit, deleteItem, restoreItem, getItems, getActiveItems, getItemById, getItemsByName, getItemsByNameAndActive } = require('../controllers/item');
const ValidateToken = require('../middleWare/validateToken');

//@desc Test Role_type API
//@route GET /api/v1/role_type
//@access Public
router.get('/', testItemAPI);

//@desc Add Item API
//@route POST /api/v1/item
//@access Private
router.post('/add', [body('item_name', 'Enter a valid item_name').isLength({ min: 1 }), body('quantity_unit', 'Enter a valid quantity_unit').isLength({ min: 1 })], addItem);

//@desc Update Item API
//@route PUT /api/v1/item/:id
//@access Private
router.put('/:id', [body('item_name', 'Enter a valid item_name').isLength({ min: 1 }), body('quantity_unit', 'Enter a valid quantity_unit').isLength({ min: 1 })], updateItem);

//@desc Delete Item API
//@route DELETE /api/v1/item/:id
//@access Private
router.delete('/:id', deleteItem);

//@desc Restore Item API
//@route DELETE /api/v1/item/restore/:id
//@access Private
router.put('/restore/:id', restoreItem);

//@desc Get Items API
//@route GET /api/v1/getall
//@access Private
router.get('/getall', getItems);

//@desc Get Active Items API
//@route GET /api/v1/getall/active
//@access Private
router.get('/getall/active', getActiveItems);

//@desc Get Item By Id API
//@route GET /api/v1/item/:id
//@access Private
router.get('/get/:id', getItemById);

//@desc POST Item By Id API
//@route POST /api/v1/item/get/by/name
//@access Private
router.post('/get/by/name', [body('item_name', 'Enter a valid item_name').isLength({ min: 1 })], getItemsByName);

//@desc POST Item By Name And Active API
//@route POST /api/v1/item//get/active/by/name
//@access Private
router.post('/get/active/by/name', [body('item_name', 'Enter a valid item_name').isLength({ min: 1 })], getItemsByNameAndActive);

//@desc Update Item API
//@route PUT /api/v1/item/update/quantity
//@access Private
router.put('/update/quantity', [body('quantity_unit', 'Enter a valid quantity_unit').isLength({ min: 1 }), body('quantity_unit_id', 'Enter a valid quantity_unit_id')], updateQuantityUnit);

module.exports = router;
