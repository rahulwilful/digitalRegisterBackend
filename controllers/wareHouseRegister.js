const logger = require('../config/logger.js');
const { validationResult, matchedData } = require('express-validator');
const Role_type = require('../modals/RoleType.js');
const warehouse_register = require('../modals/WareHouseRegister.js');
const User = require('../modals/User.js');
const Item = require('../modals/Item.js');
const StorageLocation = require('../modals/StorageLocation.js');

const testRegisterAPI = async (req, res) => {
  return res.status(200).send('WareHouseRegister API test successfull');
};

//@desc Add Record API
//@route POST /api/v1/add
//@access Private
const addRecord = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/register/add  responded with Error `);
    console.log('errors: ', errors);
    return res.status(400).json({ errors: errors.array(), message: 'No Record Found' });
  }
  const data = matchedData(req);
  console.log('data: ', data);

  try {
    const wareHouseRegister = await warehouse_register.create({
      storage_location_id: data.storage_location_id,
      warehouse_admin: data.warehouse_admin,
      pickup_person: data.pickup_person,
      item_list: data.item_list
    });
    logger.info(`${ip}: API /api/v1/register/add  responded with Success `);
    return res.status(201).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/add  responnded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get All Records API
//@route GET /api/v1/register
//@access Private
const getRecords = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const wareHouseRegister = await warehouse_register
      .find()
      .populate('storage_location_id', { _id: 0, name: 1 })
      .populate('warehouse_admin', { _id: 0, name: 1 })
      .populate('pickup_person', { _id: 0, name: 1 })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 }, // Select only specific fields
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });
    if (!wareHouseRegister) {
      logger.error(`${ip}: API /api/v1/register/get responded with Error `);
      return res.status(404).json({ error: 'No Record Found', message: 'No Record Found' });
    }
    logger.info(`${ip}: API /api/v1/register/get responded with Success `);
    return res.status(200).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Record By Id API
//@route GET /api/v1/register/:id
//@access Private
const getRecordById = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('id: ', id);
  try {
    const wareHouseRegister = await warehouse_register
      .findById(id)
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 }, // Select only specific fields
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegister) {
      logger.error(`${ip}: API /api/v1/register/getbyid responded with Error `);
      return res.status(404).json({ error: 'No Record Found', message: 'No Record Found' });
    }
    console.log('wareHouseRegister: ', wareHouseRegister);
    logger.info(`${ip}: API /api/v1/register/getbyid responded with Success `);
    return res.status(200).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/getbyid responded with Error `);
    console.log('error: ', err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Records By Location API
//@route GET /api/v1/register/get/by/location/:locationId
//@access Private
const getRecordsByLocation = async (req, res) => {
  const locationId = req.params.locationId;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('locationId: ', locationId);
  try {
    const wareHouseRegisters = await warehouse_register
      .find({ storage_location_id: locationId })
      .sort({ createdAt: -1 })
      .limit(19) // Limit to 5 records for each location
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegisters || wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/getbylocation responded with Error `);
      return res.status(404).json({ error: 'No Records Found', message: 'No Records Found' });
    }
    console.log('wareHouseRegisters: ', wareHouseRegisters);
    logger.info(`${ip}: API /api/v1/register/getbylocation responded with Success `);
    return res.status(200).json({ result: wareHouseRegisters, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/getbylocation responded with Error `);
    console.log('error: ', err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Records By Location and Date API
//@route GET /api/v1/register/get/by/location/:locationId/and/:lastDate
//@access Private
const getRecordsByLocationAndLastDate = async (req, res) => {
  const locationId = req.params.locationId;
  const lastDate = req.params.lastDate;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('locationId: ', locationId);

  try {
    let wareHouseRegisters = await warehouse_register
      .find({
        storage_location_id: locationId,
        createdAt: { $lte: new Date(lastDate) }
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    wareHouseRegisters = wareHouseRegisters.slice(1);

    if (wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/by/location/:locationId/and/:lastDate responded with Error`);
      return res.status(404).json({ error: 'No Records Found', message: 'No More Records ' });
    }

    console.log('wareHouseRegisters: ', wareHouseRegisters);
    logger.info(`${ip}: API /api/v1/register/get/by/location/:locationId/and/:lastDate responded with Success`);
    return res.status(200).json({ result: wareHouseRegisters, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/by/location/:locationId/and/:lastDate responded with Error`);
    console.log('error: ', err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Add Record API
//@route POST /api/v1/register/getby/date-range
//@access Private
const getRecordsByDateRange = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { fromDate, toDate } = matchedData(req);

  try {
    if (!fromDate || !toDate) {
      logger.error(`${ip}: API /api/v1/register/daterange responded with Error - Missing dates`);
      return res.status(400).json({ error: "Both 'fromDate' and 'toDate' are required", message: "Both 'fromDate' and 'toDate' are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from) || isNaN(to)) {
      logger.error(`${ip}: API /api/v1/register/daterange responded with Error - Invalid dates`);
      return res.status(400).json({ error: 'Invalid date format', message: 'Invalid date format' });
    }

    const wareHouseRegister = await warehouse_register
      .find({
        createdAt: {
          $gte: from,
          $lte: to
        }
      })
      .populate('storage_location_id', { _id: 0, name: 1 })
      .populate('warehouse_admin', { _id: 0, name: 1 })
      .populate('pickup_person', { _id: 0, name: 1 })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegister || wareHouseRegister.length === 0) {
      logger.error(`${ip}: API /api/v1/register/daterange responded with Error - No records found`);
      return res.status(404).json({ error: 'No records found within the specified date range', message: 'No records found within the specified date range' });
    }

    logger.info(`${ip}: API /api/v1/register/daterange responded with Success`);
    return res.status(200).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/daterange responded with Error`, err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Update Item List API
//@route PUT /api/v1/register/:id
//@access Private
const updateItemList = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/register/update responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  try {
    const wareHouseRegister = await warehouse_register.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!wareHouseRegister) {
      logger.error(`${ip}: API /api/v1/register/update responded with Error `);
      return res.status(404).json({ error: 'No Record Found', message: 'No Record Found' });
    }
    logger.info(`${ip}: API /api/v1/register/update responded with Success `);
    return res.status(200).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/update responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Delete Item from Item List API
//@route DELETE /api/v1/register/:id
//@access Private
const deleteItemFromList = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/register/delete responded with Error `);
    return res.status(400).json({ errors: errors.array(), message: 'No Record Found' });
  }
  const { item_id } = matchedData(req);

  try {
    const wareHouseRegister = await warehouse_register.findByIdAndUpdate(id, { $pull: { item_list: { item_id } } }, { new: true });
    if (!wareHouseRegister) {
      logger.error(`${ip}: API /api/v1/register/delete responded with Error `);
      return res.status(404).json({ error: 'No Record Found', message: 'No Record Found' });
    }
    logger.info(`${ip}: API /api/v1/register/delete responded with Success `);
    return res.status(200).json({ result: wareHouseRegister, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/delete responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Unique Warehouse Admins API
//@route GET /api/v1/register/get/unique-warehouse-admins
//@access Private
const getUniqueWarehouseAdmins = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const uniqueAdmins = await warehouse_register.find().distinct('warehouse_admin');

    console.log('uniqueAdmins: ', uniqueAdmins);

    const populatedAdmins = await User.find({ _id: { $in: uniqueAdmins } }, '_id name');

    console.log('populatedAdmins: ', populatedAdmins);

    if (!populatedAdmins || populatedAdmins.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/unique-warehouse-admins responded with Error`);
      return res.status(404).json({ error: 'No Warehouse Admins Found', message: 'No Warehouse Admins Found' });
    }
    logger.info(`${ip}: API /api/v1/register/get/unique-warehouse-admins responded with Success`);
    return res.status(200).json({ result: populatedAdmins, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/unique-warehouse-admins responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Unique Warehouse Admins By Storage Location API
//@route GET /api/v1/register/warehouse-admins-by-storage-location/:storageLocationId
//@access Private
const getWarehouseAdminsByStorageLocation = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const storageLocationId = req.params.storageLocationId;
  try {
    const uniqueAdmins = await warehouse_register.find({ storage_location_id: storageLocationId }).distinct('warehouse_admin');

    console.log('uniqueAdmins: ', uniqueAdmins);

    const populatedAdmins = await User.find({ _id: { $in: uniqueAdmins } }, '_id name');

    console.log('populatedAdmins: ', populatedAdmins);

    if (!populatedAdmins || populatedAdmins.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/unique-warehouse-admins/${storageLocationId} responded with Error`);
      return res.status(404).json({ error: 'No Warehouse Admins Found for the specified Storage Location', message: 'No Warehouse Admins Found for the specified Storage Location' });
    }
    logger.info(`${ip}: API /api/v1/register/get/unique-warehouse-admins/${storageLocationId} responded with Success`);
    return res.status(200).json({ result: populatedAdmins, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/unique-warehouse-admins/${storageLocationId} responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong', message: 'Something went wrong' });
  }
};

//@desc Get Unique Pickup Persons API
//@route GET /api/v1/register/get/unique-pickup-persons
//@access Private
const getUniquePickupPersons = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const uniquePickupPersons = await warehouse_register.find().distinct('pickup_person');
    const populatedPickupPersons = await User.find({ _id: { $in: uniquePickupPersons } }, '_id name');

    if (!populatedPickupPersons || populatedPickupPersons.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/unique-pickup-persons responded with Error`);
      return res.status(404).json({ error: 'No Pickup Persons Found', message: 'No Pickup Persons Found' });
    }
    logger.info(`${ip}: API /api/v1/register/get/unique-pickup-persons responded with Success`);
    return res.status(200).json({ result: populatedPickupPersons, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/unique-pickup-persons responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Unique Pickup Persons By Storage Location API
//@route GET /api/v1/register/get/pickup-persons/:storageLocationId
//@access Private
const getPickupPersonsByStorageLocation = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const storageLocationId = req.params.storageLocationId;
  try {
    const uniquePickupPersons = await warehouse_register.find({ storage_location_id: storageLocationId }).distinct('pickup_person');
    const populatedPickupPersons = await User.find({ _id: { $in: uniquePickupPersons } }, '_id name');

    if (!populatedPickupPersons || populatedPickupPersons.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/unique-pickup-persons/${storageLocationId} responded with Error`);
      return res.status(404).json({ error: 'No Pickup Persons Found for the specified Storage Location', message: 'No Pickup Persons Found for the specified Storage Location' });
    }
    logger.info(`${ip}: API /api/v1/register/get/unique-pickup-persons/${storageLocationId} responded with Success`);
    return res.status(200).json({ result: populatedPickupPersons, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/unique-pickup-persons/${storageLocationId} responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Unique Storage Locations API
//@route GET /api/v1/register/get/unique-storage-locations
//@access Private
const getUniqueStorageLocations = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const uniqueStorageLocations = await warehouse_register.find().distinct('storage_location_id');
    const populatedLocations = await StorageLocation.find({ _id: { $in: uniqueStorageLocations } }, '_id name city address pin_code');

    if (!populatedLocations || populatedLocations.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/unique-storage-locations responded with Error`);
      return res.status(404).json({ error: 'No Storage Locations Found', message: 'No Storage Locations Found' });
    }
    logger.info(`${ip}: API /api/v1/register/get/unique-storage-locations responded with Success`);
    return res.status(200).json({ result: populatedLocations, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/unique-storage-locations responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Records By Warehouse Admin API
//@route GET /api/v1/register/get/by/warehouse-admin/:adminId
//@access Private
const getRecordsByWarehouseAdmin = async (req, res) => {
  const adminId = req.params.adminId;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const wareHouseRegisters = await warehouse_register
      .find({ warehouse_admin: adminId })
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegisters || wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/by/warehouse-admin/${adminId} responded with Error`);
      return res.status(404).json({ error: 'No Records Found for the specified Warehouse Admin', message: 'No Records Found for the specified Warehouse Admin' });
    }

    logger.info(`${ip}: API /api/v1/register/get/by/warehouse-admin/${adminId} responded with Success`);
    return res.status(200).json({ result: wareHouseRegisters, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/by/warehouse-admin/${adminId} responded with Error`, err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Records By Pickup Person API
//@route GET /api/v1/register/get/by/pickup-person/:pickupPersonId
//@access Private
const getRecordsByPickupPerson = async (req, res) => {
  const pickupPersonId = req.params.pickupPersonId;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const wareHouseRegisters = await warehouse_register
      .find({ pickup_person: pickupPersonId })
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegisters || wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/by/pickup-person/${pickupPersonId} responded with Error`);
      return res.status(404).json({ error: 'No Records Found for the specified Pickup Person', message: 'No Records Found for the specified Pickup Person' });
    }

    logger.info(`${ip}: API /api/v1/register/get/by/pickup-person/${pickupPersonId} responded with Success`);
    return res.status(200).json({ result: wareHouseRegisters, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/by/pickup-person/${pickupPersonId} responded with Error`, err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Records By Item Name API
//@route GET /api/v1/register/get/by/item-name/:itemName
//@access Private
const getRecordsByItemName = async (req, res) => {
  const itemName = req.params.itemName;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const wareHouseRegisters = await warehouse_register
      .find()
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        match: { item_name: { $regex: itemName, $options: 'i' } },
        select: { _id: 1, item_name: 1, quantity_unit: 1 }
      });

    if (!wareHouseRegisters || wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/by/item-name/${itemName} responded with Error`);
      return res.status(404).json({ error: 'No Records Found for the specified Item Name', message: 'No Records Found for the specified Item Name' });
    }

    const filteredRecords = wareHouseRegisters
      .map(register => {
        const filteredItems = register.item_list.filter(item => item.item_id);
        return {
          ...register.toObject(),
          item_list: filteredItems
        };
      })
      .filter(register => register.item_list.length > 0);

    if (filteredRecords.length === 0) {
      logger.error(`${ip}: API /api/v1/register/get/by/item-name/${itemName} responded with Error`);
      return res.status(404).json({ error: 'No Records Found for the specified Item Name', message: 'No Records Found for the specified Item Name' });
    }

    logger.info(`${ip}: API /api/v1/register/get/by/item-name/${itemName} responded with Success`);
    return res.status(200).json({ result: filteredRecords, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/get/by/item-name/${itemName} responded with Error`, err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Sorted Records  API
//@route GET /api/v1/register/get/sorted/records
//@access Private
const getSortedRecords = async (req, res) => {
  const { storage_location_id, warehouse_admin, pickup_person, fromDate, toDate } = matchedData(req);
  const data = matchedData(req);
  console.log('data: ', data);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    let query = {};

    if (storage_location_id) {
      query.storage_location_id = storage_location_id;
    }
    if (warehouse_admin) {
      query.warehouse_admin = warehouse_admin;
    }
    if (pickup_person) {
      query.pickup_person = pickup_person;
    }
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate);
      }
    }

    if (Object.keys(query).length === 0) {
      logger.error(`${ip}: API /api/v1/register/sorted responded with Error: No conditions provided`);
      return res.status(400).json({
        error: 'At least one sorting condition must be provided',
        message: 'At least one sorting condition must be provided'
      });
    }

    const wareHouseRegisters = await warehouse_register
      .find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'storage_location_id',
        select: ['_id', 'name', 'city', 'address', 'pin_code']
      })
      .populate({ path: 'warehouse_admin', select: ['_id', 'name'] })
      .populate({ path: 'pickup_person', select: ['_id', 'name'] })
      .populate({
        path: 'item_list.item_id',
        match: { item_name: { $regex: data.item_name, $options: 'i' } },
        select: { _id: 1, item_name: 1, quantity_unit: 1 },
        populate: { path: 'quantity_unit', select: { _id: 1, name: 1 } }
      });

    if (!wareHouseRegisters || wareHouseRegisters.length === 0) {
      logger.error(`${ip}: API /api/v1/register/sorted responded with Error: No records found`);
      return res.status(404).json({ error: 'No records found matching the provided conditions', message: 'No more records found ' });
    }

    // Filter out items with item_id as null
    const filteredWareHouseRegisters = wareHouseRegisters
      .map(register => {
        const filteredItemList = register.item_list.filter(item => item.item_id !== null);
        return {
          ...register.toObject(),
          item_list: filteredItemList
        };
      })
      .filter(register => register.item_list.length > 0);

    logger.info(`${ip}: API /api/v1/register/sorted responded with Success`);
    return res.status(200).json({ result: filteredWareHouseRegisters, message: 'Records Found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/register/sorted responded with Error`, err);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

module.exports = {
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
};
