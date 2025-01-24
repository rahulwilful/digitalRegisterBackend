const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { testStorageLocationAPI, addStorageLocation, getStorageLocations, getStorageLocationById, updateStorageLocation, getStorageLocationsByName, deleteStorageLocation, restoreStorageLocation } = require('../controllers/storageLocation');
const ValidateToken = require('../middleWare/validateToken');

//@desc Test Role_type API
//@route GET /api/v1/role_type
//@access Public
router.get('/', testStorageLocationAPI);

//@desc Add StorageLocation API
//@route POST /api/v1/storage/location
//@access Private
router.post('/add', [body('name', 'Enter a valid name').isLength({ min: 3 }), body('city', 'Enter a valid city').isLength({ min: 3 }), body('state', 'Enter a valid state').isLength({ min: 3 }), body('address', 'Enter a valid address').isLength({ min: 3 }), body('pin_code', 'Enter a valid pin_code').isLength({ min: 3 })], addStorageLocation);

//@desc Get StorageLocations API
//@route GET /api/v1/storage/location/getall
//@access Public
router.get('/getall', getStorageLocations);

//@desc Get StorageLocation By Id API
//@route GET /api/v1/storage/location/get/:id
//@access Public
router.get('/get/:id', getStorageLocationById);

//@desc Get Storage Locations By Name API
//@route POST /api/v1/storage/location/get/by/name
//@access Public
router.post('/get/by/name', [body('name', 'Enter a valid name').isLength({ min: 1 })], getStorageLocationsByName);

//@desc Update StorageLocation API
//@route PUT /api/v1/storage/location/update/:id
//@access Private
router.put('/update/:id', [body('name', 'Enter a valid name').isLength({ min: 3 }), body('city', 'Enter a valid city').isLength({ min: 3 }), body('state', 'Enter a valid state').isLength({ min: 3 }), body('address', 'Enter a valid address').isLength({ min: 3 }), body('pin_code', 'Enter a valid pin_code').isLength({ min: 3 })], updateStorageLocation);

//@desc Delete StorageLocation API
//@route DELETE /api/v1/storage/location/delete/:id
//@access Private
router.delete('/delete/:id', deleteStorageLocation);

//@desc Restore StorageLocation API
//@route PUT /api/v1/storage/location/restore/:id
//@access Private
router.put('/restore/:id', restoreStorageLocation);

module.exports = router;
