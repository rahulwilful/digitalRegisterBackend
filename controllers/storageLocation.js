const logger = require('../config/logger.js');
const { validationResult, matchedData } = require('express-validator');
const Role_type = require('../modals/RoleType.js');
const StorageLocation = require('../modals/StorageLocation.js');

const testStorageLocationAPI = async (req, res) => {
  return res.status(200).send('StorageLocation API test successfull');
};

//@desc Add StorageLocation API
//@route POST /api/v1/storage/location/add
//@access Private
const addStorageLocation = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const data = matchedData(req);

  console.log('data: ', data);
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/storage/location/add  responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const oldLocation = await StorageLocation.findOne({ name: data.name });

    if (oldLocation) {
      logger.error(`${ip}: API /api/v1/storage/location/add  responded with Error `);
      return res.status(409).json({ message: 'Storage location with same name already exists' });
    }

    const storageLocation = await StorageLocation.create({
      name: data.name,
      city: data.city,
      state: data.state || null,
      address: data.address,
      pin_code: data.pin_code
    });

    logger.info(`${ip}: API /api/v1/storage/location/add  responded with Success `);
    return res.status(201).json({ result: storageLocation, message: 'Storage location added successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/add  responnded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get StorageLocations API
//@route GET /api/v1/storage/location/getall
//@access Public
const getStorageLocations = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const storageLocations = await StorageLocation.find();
    logger.info(`${ip}: API /api/v1/storageLocation responded with Success`);
    return res.status(200).json({ result: storageLocations, messsage: 'Storage Locations found successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storageLocation responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get StorageLocation By Id API
//@route GET /api/v1/storage/location/get/:id
//@access Public
const getStorageLocationById = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const storageLocation = await StorageLocation.findById(id);
    if (!storageLocation) {
      logger.error(`${ip}: API /api/v1/storage/location/:id responded with Error`);
      return res.status(404).json({ error: 'Storage location not found', message: 'Something went wrong' });
    }
    logger.info(`${ip}: API /api/v1/storage/location/:id responded with Success`);
    return res.status(200).json({ result: storageLocation, message: 'Storage location found successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/:id responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Update StorageLocation API
//@route PUT /api/v1/storage/location/update/:id
//@access Private
const updateStorageLocation = async (req, res) => {
  const errors = validationResult(req);
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/storage/location/update/:id responded with Error`);
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);

  try {
    const storageLocation = await StorageLocation.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!storageLocation) {
      logger.error(`${ip}: API /api/v1/storage/location/update/:id responded with Error`);
      return res.status(404).json({ error: 'Storage location not found', message: 'Storage location not found' });
    }

    logger.info(`${ip}: API /api/v1/storage/location/update/:id responded with Success`);
    return res.status(200).json({ result: storageLocation, message: 'Storage location updated successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/update/:id responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Storage Locations By Name API
//@route POST /api/v1/storage/location/get/by/name
//@access Public
const getStorageLocationsByName = async (req, res) => {
  const errors = validationResult(req);
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/storage/location/update/:id responded with Error`);
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = matchedData(req);

  try {
    const storageLocations = await StorageLocation.find({ name: new RegExp(name, 'i') });
    if (!storageLocations || storageLocations.length === 0) {
      logger.error(`${ip}: API /api/v1/storage/location/get/by/name responded with Error`);
      return res.status(404).json({ error: 'No Storage Locations Found with the specified name', message: 'No Storage Locations Found with the specified name' });
    }

    logger.info(`${ip}: API /api/v1/storage/location/get/by/name responded with Success`);
    return res.status(200).json({ result: storageLocations, message: 'Storage Locations found successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/get/by/name responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Delete Storage Location API
//@route DELETE /api/v1/storage/location/delete/:id
//@access Public
const deleteStorageLocation = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const storageLocation = await StorageLocation.findByIdAndUpdate(id, { is_delete: true }, { new: true });

    if (!storageLocation) {
      logger.error(`${ip}: API /api/v1/storage/location/delete/:id responded with Error`);
      return res.status(404).json({ error: 'Storage Location not found', message: 'Something went wrong' });
    }

    logger.info(`${ip}: API /api/v1/storage/location/delete/:id responded with Success`);
    return res.status(200).json({ result: storageLocation, message: 'Storage Location deleted successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/delete/:id responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Restore Storage Location API
//@route DELETE /api/v1/storage/location/restore/:id
//@access Public
const restoreStorageLocation = async (req, res) => {
  const id = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const storageLocation = await StorageLocation.findByIdAndUpdate(id, { is_delete: false }, { new: true });

    if (!storageLocation) {
      logger.error(`${ip}: API /api/v1/storage/location/restore/:id responded with Error`);
      return res.status(404).json({ error: 'Storage Location not found', message: 'Something went wrong' });
    }

    logger.info(`${ip}: API /api/v1/storage/location/restore/:id responded with Success`);
    return res.status(200).json({ result: storageLocation, message: 'Storage Location restored successfully' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/storage/location/restore/:id responded with Error`);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

module.exports = {
  testStorageLocationAPI,

  getStorageLocationsByName,
  addStorageLocation,

  getStorageLocations,
  getStorageLocationById,

  updateStorageLocation,
  deleteStorageLocation,
  restoreStorageLocation
};
