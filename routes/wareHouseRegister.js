const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  testRegisterAPI,

  addRecord,
  updateItemList,
  deleteItemFromList,

  getRecords,
  getRecordById,
  getRecordsByDateRange,

  getUniqueWarehouseAdmins,
  getUniquePickupPersons,
  getUniqueStorageLocations,

  getWarehouseAdminsByStorageLocation,
  getPickupPersonsByStorageLocation,

  getRecordsByLocation,
  getRecordsByLocationAndLastDate,

  getRecordsByWarehouseAdmin,
  getRecordsByPickupPerson,
  getRecordsByItemName,

  getSortedRecords
} = require('../controllers/wareHouseRegister');
const ValidateToken = require('../middleWare/validateToken');

//@desc Test Role_type API
//@route GET /api/v1/role_type
//@access Private
router.get('/', testRegisterAPI);

//@desc Add Record API
//@route POST /api/v1/add
//@access Private
router.post(
  '/add',
  body('storage_location_id', 'Enter a valid storage_location_id').isLength({
    min: 3
  }),
  body('warehouse_admin', 'Enter a valid warehouse_admin').isLength({ min: 3 }),
  body('pickup_person', 'Enter a valid pickup_person').isLength({ min: 3 }),
  body('item_list', 'Enter a valid item_list').isLength({ min: 1 }),
  body(`pickup_or_drop`),
  addRecord
);

//@desc Get Records API
//@route GET /api/v1/register/getall
//@access Private
router.get('/getall', getRecords);

//@desc Get Record By Id API
//@route GET /api/v1/register/get/:id
//@access Private
router.get('/get/:id', getRecordById);

//@desc Get Records By Location API
//@route GET /api/v1/register/get/by/location/:locationId
//@access Private
router.get('/get/by/location/:locationId', getRecordsByLocation);

//@desc Get Records By Location and Date API
//@route GET /api/v1/register/get/by/location/:locationId/and/:lastDate
//@access Private
router.get('/get/by/location/:locationId/and/:lastDate', getRecordsByLocationAndLastDate);

//@desc Get Records By Warehouse Admin API
//@route GET /api/v1/register/get/by/warehouse-admin/:adminId
//@access Private
router.get('/get/by/warehouse-admin/:adminId', getRecordsByWarehouseAdmin);

//@desc Get Records By Pickup Person API
//@route GET /api/v1/register/get/by/pickup-person/:pickupPersonId
//@access Private
router.get('/get/by/pickup-person/:pickupPersonId', getRecordsByPickupPerson);

//@desc Get Records By Item Name API
//@route GET /api/v1/register/get/by/item-name/:itemName
//@access Private
router.get('/get/by/item-name/:itemName', getRecordsByItemName);

//@desc Get Sorted Records API
//@route GET /api/v1/register/get/sorted/records
//@access Private
router.post('/get/sorted/records', [body('storage_location_id'), body('warehouse_admin'), body('pickup_person'), body('fromDate'), body('toDate'), body('item_name')], getSortedRecords);

//@desc Get Record By Id API
//@route GET /api/v1/register/getby/date-range
//@access Private
router.get('/get/by/date-range', [body('fromDate', 'Enter a valid fromDate'), body('toDate', 'Enter a valid toDate')], getRecordsByDateRange);

//@desc Update Item List API
//@route PUT /api/v1/register/update/:id
//@access Private
router.put(
  '/update/:id',
  body('storage_location_id', 'Enter a valid storage_location_id').isLength({
    min: 3
  }),
  body('warehouse_admin', 'Enter a valid warehouse_admin').isLength({ min: 3 }),
  body('pickup_person', 'Enter a valid pickup_person').isLength({ min: 3 }),
  body('item_list', 'Enter a valid item_list').isLength({ min: 1 }),
  updateItemList
);

//@desc Delete Item From List API
//@route DELETE /api/v1/register/delete/:id
//@access Private
router.delete('/delete/:id', deleteItemFromList);

//@desc Get Unique Warehouse Admins API
//@route GET /api/v1/register/get/unique-warehouse-admins
//@access Private
router.get('/get/unique-warehouse-admins', getUniqueWarehouseAdmins);

//@desc Get Unique Warehouse Admins By Storage Location API
//@route GET /api/v1/register/get/warehouse-admins-by-storage-location/:storageLocationId
//@access Private
router.get('/get/warehouse-admins-by-storage-location/:storageLocationId', getWarehouseAdminsByStorageLocation);

//@desc Get Unique Pickup Persons API
//@route GET /api/v1/register/get/unique-pickup-persons
//@access Private
router.get('/get/unique-pickup-persons', getUniquePickupPersons);

//@desc Get Unique Pickup Persons By Storage Location API
//@route GET /api/v1/register/get/pickup-persons-by-storage-location/:storageLocationId
//@access Private
router.get('/get/pickup-persons-by-storage-location/:storageLocationId', getPickupPersonsByStorageLocation);

//@desc Get Unique Storage Locations API
//@route GET /api/v1/register/get/unique-storage-locations
//@access Private
router.get('/get/unique-storage-locations', getUniqueStorageLocations);

module.exports = router;
