const logger = require('../config/logger.js');
const { validationResult, matchedData } = require('express-validator');
const Quantity_unit = require('../modals/QuantityUnit.js');

//@desc Test Quantity Unit API
//@route GET /api/v1/quantity_unit
//@access Public
const testQuantityAPI = async (req, res) => {
  return res.status(200).send('test quantity API successfull');
};

//@desc Add Quantity Unit API
//@route POST /api/v1/quantity_unit
//@access Private
const addQuantityUnit = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/quantity_unit responded with Error `);
    return res.status(400).json({ errors: errors.array(), message: 'Something went wrong' });
  }
  const data = matchedData(req);
  console.log('data: ', data);
  try {
    const oldQuantityUnit = await Quantity_unit.findOne({ name: data.name });

    if (oldQuantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit responded with Error `);
      return res.status(409).json({ message: `Quantity unit already exists` });
    }

    const quantityUnit = await Quantity_unit.create(data);
    logger.info(`${ip}: API /api/v1/quantity_unit responded with Success `);
    return res.status(201).json({ result: quantityUnit, message: 'Quantity unit added' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get All Quantity Unit API
//@route GET /api/v1/quantity_unit/getall
//@access Private
const getAllQuantityUnit = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const quantityUnits = await Quantity_unit.find().sort({ create_date: -1 });
    logger.info(`${ip}: API /api/v1/quantity_unit/getall responded with Success `);
    return res.status(200).json({ result: quantityUnits, message: 'All uuantity units uound' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/getall responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Quantity Unit By Id API
//@route GET /api/v1/quantity_unit/:id
//@access Private
const getQuantityUnitById = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const quantityUnit = await Quantity_unit.findById(id);
    if (!quantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit/:id responded with Error `);
      return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
    }
    logger.info(`${ip}: API /api/v1/quantity_unit/:id responded with Success `);
    return res.status(200).json({ result: quantityUnit, message: 'Quantity unit found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Quantity Unit By Name API
//@route POST /api/v1/quantity_unit/get/by/name
//@access Private
const getQuantityUnitByName = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { name } = matchedData(req);
  if (name === '') {
    logger.error(`${ip}: API /api/v1/quantity_unit/get/by/name responded with Error `);
    return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
  }
  try {
    const quantityUnit = await Quantity_unit.find({ name: { $regex: new RegExp(name, 'i') } });
    if (!quantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit/get/by/name responded with Error `);
      return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
    }
    logger.info(`${ip}: API /api/v1/quantity_unit/get/by/name responded with Success `);
    return res.status(200).json({ result: quantityUnit, message: 'Quantity unit found' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/get/by/name responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Update Quantity Unit API
//@route PUT /api/v1/quantity_unit/:id
//@access Private
const updateQuantityUnit = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/quantity_unit/:id responded with Error `);
    return res.status(400).json({ errors: errors.array(), message: 'Something went wrong' });
  }
  const data = matchedData(req);
  try {
    const oldQuantityUnit = await Quantity_unit.findById(id);
    if (!oldQuantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit/:id responded with Error `);
      return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
    }
    const quantityUnit = await Quantity_unit.findByIdAndUpdate(id, { $set: data }, { new: true });
    logger.info(`${ip}: API /api/v1/quantity_unit/:id responded with Success `);
    return res.status(200).json({ result: quantityUnit, message: 'Quantity Unit Updated' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Delete Quantity Unit API
//@route DELETE /api/v1/quantity_unit/delete/:id
//@access Private
const deleteQuantityUnit = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const oldQuantityUnit = await Quantity_unit.findById(id);
    if (!oldQuantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit/delete/:id responded with Error `);
      return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
    }
    const quantityUnit = await Quantity_unit.findByIdAndUpdate(id, { $set: { is_delete: true } }, { new: true });
    logger.info(`${ip}: API /api/v1/quantity_unit/delete/:id responded with Success `);
    return res.status(200).json({ result: quantityUnit, message: 'Quantity Unit deleted' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/delete/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Restore Quantity Unit API
//@route DELETE /api/v1/quantity_unit/restore/:id
//@access Private
const restoreQuantityUnit = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const oldQuantityUnit = await Quantity_unit.findById(id);
    if (!oldQuantityUnit) {
      logger.error(`${ip}: API /api/v1/quantity_unit/restore/:id responded with Error `);
      return res.status(404).json({ error: 'Quantity unit not found', message: 'Quantity unit not found' });
    }
    const quantityUnit = await Quantity_unit.findByIdAndUpdate(id, { $set: { is_delete: false } }, { new: true });
    logger.info(`${ip}: API /api/v1/quantity_unit/restore/:id responded with Success `);
    return res.status(200).json({ result: quantityUnit, message: 'Quantity Unit restored' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/quantity_unit/restore/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

module.exports = {
  testQuantityAPI,
  addQuantityUnit,
  getAllQuantityUnit,

  getQuantityUnitById,
  getQuantityUnitByName,

  updateQuantityUnit,
  deleteQuantityUnit,
  restoreQuantityUnit
};
