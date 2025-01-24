const logger = require('../config/logger.js');
const { validationResult, matchedData } = require('express-validator');
const Item = require('../modals/Item.js');
const Quantity_unit = require('../modals/QuantityUnit.js');

const testItemAPI = async (req, res) => {
  return res.status(200).send('Item API test successfull');
};

//@desc Add Item API
//@route POST /api/v1/item
//@access Private
const addItem = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/item responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);
  try {
    const oldItem = await Item.findOne({ item_name: data.item_name });

    if (oldItem) {
      logger.error(`${ip}: API /api/v1/item responded with Error `);
      return res.status(409).json({ message: 'Item already exists' });
    }

    const item = await Item.create(data);
    logger.info(`${ip}: API /api/v1/item responded with Success `);
    return res.status(201).json({ result: item });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Update Item API
//@route PUT /api/v1/item/:id
//@access Private
const updateItem = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/item/:id responded with Error `);
    return res.status(400).json({ errors: errors.array(), message: 'Something went wrong' });
  }
  const data = matchedData(req);
  console.log('data: ', data);
  const id = req.params.id;
  try {
    const item = await Item.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!item) {
      logger.error(`${ip}: API /api/v1/item/:id responded with Error `);
      return res.status(404).json({ error: 'Item not found', message: 'Item not found' });
    }
    logger.info(`${ip}: API /api/v1/item/:id responded with Success `);
    return res.status(200).json({ result: item, message: 'Item Updated' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Delete Item API
//@route DELETE /api/v1/item/:id
//@access Private
const deleteItem = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const item = await Item.findByIdAndUpdate(id, { $set: { is_delete: true } }, { new: true });
    if (!item) {
      logger.error(`${ip}: API /api/v1/item/:id responded with Error `);
      return res.status(404).json({ error: 'Item not found', message: 'Item not found' });
    }
    logger.info(`${ip}: API /api/v1/item/:id responded with Success `);
    return res.status(200).json({ result: item, messsage: 'Item Deleted' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Restore Item API
//@route DELETE /api/v1/item/restore/:id
//@access Private
const restoreItem = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const item = await Item.findByIdAndUpdate(id, { $set: { is_delete: false } }, { new: true });
    if (!item) {
      logger.error(`${ip}: API /api/v1/item/restore/:id responded with Error `);
      return res.status(404).json({ error: 'Item not found' });
    }
    logger.info(`${ip}: API /api/v1/item/restore/:id responded with Success `);
    return res.status(200).json({ result: item, message: 'Item Restored' });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/restore/:id responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Items API
//@route GET /api/v1/getall
//@access Private
const getItems = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const items = await Item.find().sort({ item_name: 1 });
    logger.info(`${ip}: API /api/v1/item/getall responded with Success `);
    return res.status(200).json({ result: items });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/getall responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Items API
//@route GET /api/v1/getall/active
//@access Private
const getActiveItems = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const items = await Item.find({ is_delete: false }).sort({ create_date: -1 });
    logger.info(`${ip}: API /api/v1/item/getall responded with Success `);
    return res.status(200).json({ result: items });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/getall responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc Get Item By Id API
//@route GET /api/v1/item/:id
//@access Private
const getItemById = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;
  try {
    const item = await Item.findById(id);
    if (!item) {
      logger.error(`${ip}: API /api/v1/item/getbyid responded with Error `);
      return res.status(404).json({ error: 'Item not found' });
    }
    logger.info(`${ip}: API /api/v1/item/getbyid responded with Success `);
    return res.status(200).json({ result: item });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/item/getbyid responded with Error `);
    return res.status(500).json({ error: err, message: 'Something went wrong' });
  }
};

//@desc POST Item By Id API
//@route POST /api/v1/item/get/by/name
//@access Private
const getItemsByName = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const data = matchedData(req);
  console.log('data: ', data);
  console.log(req.query);
  try {
    const itemName = req.query.itemName;

    if (!data.item_name) {
      logger.error(`${ip}: API /api/v1/item/get/by/name responded with Error `);
      return res.status(400).json({ message: 'Name query parameter is required.' });
    }

    const regex = new RegExp(data.item_name, 'i');

    const items = await Item.find({
      item_name: regex
    });

    if (items.length === 0) {
      logger.error(`${ip}: API /api/v1/item/get/by/name responded with Error `);
      return res.status(404).json({ message: 'No items found.' });
    }

    logger.info(`${ip}: API /api/v1/item/get/by/name responded with Success `);
    res.status(200).json({ result: items, message: 'Items Found' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/item/get/by/name responded with Error `, error);
    res.status(500).json({ message: 'An error occurred while fetching items.', error: error });
  }
};

//@desc POST Item By Name And Active API
//@route POST /api/v1/item//get/active/by/name
//@access Private
const getItemsByNameAndActive = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const data = matchedData(req);
  console.log('data: ', data);
  console.log(req.query);
  try {
    const itemName = req.query.itemName;

    if (!data.item_name) {
      logger.error(`${ip}: API /api/v1/item//get/active/by/name responded with Error `);
      return res.status(400).json({ message: 'Name query parameter is required.' });
    }

    const regex = new RegExp(data.item_name, 'i');

    const items = await Item.find({
      item_name: regex,
      is_delete: false
    });

    if (items.length === 0) {
      logger.error(`${ip}: API /api/v1/item//get/active/by/name responded with Error `);
      return res.status(404).json({ message: 'No items found.' });
    }

    logger.info(`${ip}: API /api/v1/item//get/active/by/name responded with Success `);
    res.status(200).json({ result: items, message: 'Items Found' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/item//get/active/by/name responded with Error `, error);
    res.status(500).json({ message: 'An error occurred while fetching items.', error: error });
  }
};

module.exports = {
  testItemAPI,
  addItem,
  updateItem,
  deleteItem,
  restoreItem,
  getItems,
  getItemById,
  getItemsByName,
  getActiveItems,
  getItemsByNameAndActive
};
