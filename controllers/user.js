const { validationResult, matchedData } = require('express-validator');
const User = require('../modals/User');
const Role_type = require('../modals/RoleType');
const bcrypt = require('bcryptjs');
const secret = 'test';
const logger = require('../config/logger.js');
const jwt = require('jsonwebtoken');

const testUserAPI = async (req, res) => {
  return res.status(200).send('User API test successful');
};

//@desc Create User API
//@route POST user/create/super/admin
//@access Public
const createSuperAdmin = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/create/super/admin responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const oldUser = await User.findOne({ email: data.email });

  if (oldUser) {
    logger.error(`${ip}: API /api/v1/user/create/super/admin responded with User already registered! for email: ${data.email} `);
    return res.status(409).json({ message: 'Email already registered!' });
  }

  const phone = await User.findOne({ mobile_no: data.number });

  if (phone) {
    logger.error(`${ip}: API /api/v1/user/create/super/admin responded with User already registered! for email: ${data.number} `);
    return res.status(409).json({ message: 'Number already registered!' });
  }

  const role = await Role_type.findOne({ value: 'super_admin' });
  const role_id = role._id;

  const salt = await bcrypt.genSalt(10);
  const securedPass = await bcrypt.hash(data.password, salt);

  await User.create({
    name: data.name,
    email: data.email,
    mobile_no: data.mobile_no,
    password: securedPass,
    role_type: role_id,
    storage_location_id: data.storage_location_id || null
  })
    .then(user => {
      logger.info(`${ip}: API /api/v1/user/create/super/admin responded with Success `);
      return res.status(201).json({ result: user });
    })
    .catch(err => {
      logger.error(`${ip}: API /api/v1/user/create/super/admin responded with Error `);
      return res.status(500).json({ message: err.message });
    });
};

//@desc Create User API
//@route POST user/create
//@access Private
const createUser = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/create responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  if (!req.user) {
    logger.error(`${ip}: API /api/v1/api/v1/user/create   responnded with Error , "Unautherized user " `);
    return res.status(500).json({ message: 'Unauthorized user' });
  }

  const superAdmin = await Role_type.findOne({ value: 'super_admin' });
  const super_admin_id = superAdmin._id;

  if (req.user.role_type._iduper_admin_id) {
    logger.error(`${ip}: API /api/v1/user/create responded with Error "Only super admin can create user" `);
    return res.status(403).json({ message: 'Unauthorized action' });
  }

  const oldUser = await User.findOne({ email: data.email });

  if (oldUser) {
    logger.error(`${ip}: API /api/v1/user/create responded with User already registered! for email: ${data.email} `);
    return res.status(409).json({ message: 'User already registered!' });
  }

  const phone = await User.findOne({ mobile_no: data.mobile_no });

  if (phone) {
    logger.error(`${ip}: API /api/v1/user/create responded with User already registered! for email: ${data.number} `);
    return res.status(409).json({ message: 'Number already registered!' });
  }

  const salt = await bcrypt.genSalt(10);
  const securedPass = await bcrypt.hash(data.password, salt);

  try {
    const user = await User.create({
      name: data.name,
      email: data.email,
      mobile_no: data.mobile_no,
      password: securedPass,
      role_type: data.role_type,
      storage_location_id: data.storage_location_id || null
    });

    const newUser = await User.findOne({ _id: user._id }).populate({ path: 'role_type' }).populate({ path: 'storage_location_id' });

    logger.info(`${ip}: API /api/v1/user/create responded with Success `);
    return res.status(201).json({ result: newUser, message: 'User created successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/create responded with Error `);
    return res.status(500).json({ message: error.message });
  }
};

//@desc LogIn User API
//@route post user/login
//@access Public
const logIn = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/login responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const oldUser = await User.findOne({ email }).populate({ path: 'role_type' }).populate({ path: 'storage_location_id' });
    if (!oldUser) {
      logger.error(`${ip}: API /api/v1/user/login responded User does not exist with email:  ${email} `);
      return res.status(404).json({ error: 'User Does Not Exist', message: 'User Does Not Exist' });
    }

    if (oldUser.is_delete) {
      logger.error(`${ip}: API /api/v1/user/login Access Denied for email:  ${email} `);
      return res.status(400).json({ error: 'Access Denied', message: 'Access Denied , Contact Admin' });
    }

    const isPassCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPassCorrect) {
      logger.error(`${ip}: API /api/v1/user/login responded password incorrect `);
      return res.status(400).json({ error: 'invalid password ', message: 'Incorrect password' });
    }
    const token = jwt.sign({ user: oldUser }, secret);

    logger.info(`${ip}: API /api/v1/login | Login Successful" `);
    return res.status(200).json({ result: oldUser, token });
  } catch (e) {
    logger.error(`${ip}: API /api/v1/user/login responded with Error `);
    return res.status(500).json(e, ' Something went wrong');
  }
};

//@desc Create User API
//@route POST user/update/:id
//@access Private
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API user/update/:id responded with Error `);
    return res.status(400).json({ errors: errors.array(), message: 'Error' });
  }
  const data = matchedData(req);
  // console.log('data: ', data);

  const oldUser = await User.findOne({ _id: req.params.id });

  if (!req.user) {
    logger.error(`${ip}: API /api/v1/api/v1/ user/update/:id   responnded with Error , "Unautherized user" `);
    return res.status(500).json({ message: 'Unauthorized user' });
  }

  const superAdmin = await Role_type.findOne({ value: 'super_admin' });
  const super_admin_id = superAdmin._id;

  if (req.user.role_type._id != super_admin_id) {
    logger.error(`${ip}: API /api/v1/ user/update/:id responded with Error "Only super admin can update user" `);
    return res.status(403).json({ message: 'Only super admin can update user' });
  }

  if (!oldUser) {
    logger.error(`${ip}: API user/update/:id user not found `);
    return res.status(400).json({ message: 'user not found' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: data.name,
        mobile_no: data.mobile_no,
        email: data.email,
        profile: data.profile,
        role_type: data.role_type,
        storage_location_id: data.storage_location_id
      },
      {
        new: true
      }
    )
      .populate({ path: 'role_type' })
      .populate({ path: 'storage_location_id' });

    logger.info(`${ip}: API user/updateuser/:id responded with Success `);
    return res.status(201).json({ result: user, message: 'User Updated' });
  } catch (err) {
    logger.error(`${ip}: API user/updateuser/:id responded with Error `);
    return res.status(500).json({ message: err.message });
  }
};

//@desc Create User API
//@route POST user/updaterole_type/:id
//@access Private
const updateRoleType = async (req, res) => {
  const errors = validationResult(req);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API user/updaterole_type/:id responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const oldUser = await User.findOne({ _id: req.params.id });

  if (!oldUser) {
    logger.error(`${ip}: API user/updaterole_type/:id user not found `);
    return res.status(400).json({ message: 'user not found' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        role_type: data.role_type
      },
      {
        new: true
      }
    );

    logger.info(`${ip}: API user/updaterole_type/:id responded with Success `);
    return res.status(201).json({ result: user });
  } catch (err) {
    logger.error(`${ip}: API user/updaterole_type/:id responded with Error `);
    return res.status(500).json({ message: err.message });
  }
};

//@desc Get User Info API
//@route post user/get/:id
//@access Private
const getUserById = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const userId = req.params.id;
  if (!userId) {
    logger.error(`${ip}: API /api/v1/user/get/:id responded UserId required `);
    return res.status(400).json({ message: 'UserId required' });
  }

  if (!req.user) {
    logger.error(`${ip}: API /api/v1/api/v1/user/get/:id   responnded with Error , "Unautherized user" `);
    return res.status(500).json({ message: 'Unauthorized user' });
  }

  const superAdmin = await Role_type.findOne({ value: 'super_admin' });
  const super_admin_id = superAdmin._id;

  if (req.user.role_type._id != super_admin_id) {
    logger.error(`${ip}: API /api/v1/user/get/:id responded with Error "Unauthorized user" `);
    return res.status(403).json({ message: 'Unauthorized user' });
  }

  try {
    const user = await User.findById({ _id: userId }).populate({ path: 'role_type' }).populate({ path: 'storage_location_id' });

    logger.info(`${ip}: API /api/v1/user/get/:id | responded with "Got user by ID successfully" `);
    return res.status(201).json({ result: user, message: 'Got user by ID successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/get/:id responded with user not found `);
    return res.status(500).json({ error: error, message: 'User not found' });
  }
};

//@desc Get Users By Name API
//@route POST /user/get/by/name
//@access Private
const getUsersByName = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const data = matchedData(req);
  console.log('data: ', data);
  if (!data.name) {
    logger.error(`${ip}: API /api/v1/user/get/by/name responded with name required`);
    return res.status(400).json({ message: 'name required' });
  }

  if (!req.user) {
    logger.error(`${ip}: API /api/v1/user/get/by/name responded with Error, "Unauthorized user"`);
    return res.status(500).json({ message: 'Unauthorized user' });
  }

  const superAdmin = await Role_type.findOne({ value: 'super_admin' });
  const super_admin_id = superAdmin._id;

  if (req.user.role_type._id != super_admin_id) {
    logger.error(`${ip}: API /api/v1/user/get/by/name responded with Error "Unauthorized user"`);
    return res.status(403).json({ message: 'Unauthorized user' });
  }

  try {
    const users = await User.find({ name: { $regex: data.name, $options: 'i' } })
      .populate({ path: 'role_type' })
      .populate({ path: 'storage_location_id' });

    if (!users.length) {
      logger.error(`${ip}: API /api/v1/user/get/by/name responded with "No users found"`);
      return res.status(404).json({ message: 'No users found' });
    }

    logger.info(`${ip}: API /api/v1/user/get/by/name responded with "Got users by name successfully"`);
    return res.status(200).json({ result: users, message: 'Got users by name successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/get/by/name responded with error: ${error.message}`);
    return res.status(500).json({ error: error, message: 'Internal server error' });
  }
};

//@desc Get Pickup Persons By Storage Location ID API
//@route POST /user/get/pickup-persons-by-storage-location/:id
//@access Private
const getPickupPersonsByStorageLocationId = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const storageLocationId = req.params.id;
  if (!storageLocationId) {
    logger.error(`${ip}: API /user/get/pickup-persons-by-storage-location/:id | Missing storageLocationId`);
    return res.status(400).json({ message: 'StorageLocationId is required' });
  }

  if (!req.user) {
    logger.error(`${ip}: API /user/get/pickup-persons-by-storage-location/:id | Unauthorized access`);
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  try {
    logger.debug(`Query Params: { storageLocationId: ${storageLocationId}, roleTypeValue: 'pickup_boy' }`);

    const pickupRole = await Role_type.findOne({ value: 'pickup_boy' });
    if (!pickupRole) {
      logger.error(`${ip}: Role with value 'pickup_boy' not found`);
      return res.status(404).json({ message: "Role 'pickup_boy' not found" });
    }

    const pickupPersons = await User.find({
      storage_location_id: storageLocationId,
      role_type: pickupRole._id
    })
      .populate('role_type')
      .populate('storage_location_id');

    if (!pickupPersons.length) {
      logger.info(`${ip}: API /user/get/pickup-persons-by-storage-location/:id | No pickup persons found`);
      return res.status(404).json({ message: 'No pickup persons found' });
    }

    logger.info(`${ip}: API /user/get/pickup-persons-by-storage-location/:id | Successfully fetched pickup persons`);
    return res.status(200).json({ result: pickupPersons, message: 'Successfully fetched pickup persons' });
  } catch (error) {
    logger.error(`${ip}: API /user/get/pickup-persons-by-storage-location/:id | Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error', message: 'Internal server error' });
  }
};

//@desc Get Current User API
//@route GET /user
//@access Private
const getCurrentUser = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    if (!req.user) {
      logger.error(`${ip}: API /api/v1/user/getcurrentuser responded with Error , "Unauthorized user " `);
      return res.status(500).json({ message: 'Unauthorized user' });
    }

    logger.info(`${ip}: API /api/v1/getcurrentuser | responded with "Successfully retrieved current user" `);
    return res.status(200).json({ result: req.user, message: 'User Retrieved' });
  } catch (e) {
    logger.error(`${ip}: API /api/v1/user/getcurrentuser responded with Error, " something went wrong"`);
    return res.status(500).json({ message: 'Something went wrong current user not found' });
  }
};

//@desc Test User API
//@route GET /getalluser
//@access Private
const getAllUsers = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    if (!req.user) {
      logger.error(`${ip}: API /api/v1/api/v1/user/get/:id   responnded with Error , "Unautherized user" `);
      return res.status(500).json({ message: 'Unauthorized user' });
    }

    const superAdmin = await Role_type.findOne({ value: 'super_admin' });
    const super_admin_id = superAdmin._id;

    if (req.user.role_type._id != super_admin_id) {
      logger.error(`${ip}: API /api/v1/user/get/:id responded with Error "Unauthorized user" `);
      return res.status(403).json({ message: 'Unauthorized user' });
    }

    const users = await User.find().populate({ path: 'role_type' }).populate({ path: 'storage_location_id' });
    logger.info(`${ip}: API /api/v1/user/getallusers | Responded with "Successfully retrieved all users"`);

    return res.status(200).json({ result: users, message: 'All users retrieved successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/getallusers | Responded with Error: ${error.message}`);

    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//@desc Create User API
//@route POST user/reset-password
//@access Public
const resetPassword = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const data = matchedData(req);

  try {
    const email = await User.findOne({ email: data.email });

    if (!email) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPassCorrect = await bcrypt.compare(data.old_password, email.password);

    if (!isPassCorrect) {
      logger.error(`${ip}: API /api/v1/user/reset-password responded with password incorrect `);
      return res.status(400).json({ error: 'Invalid password', message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const securedPass = await bcrypt.hash(data.password, salt);

    const user = await User.findOneAndUpdate({ email: data.email }, { password: securedPass });

    logger.info(`${ip}: API /api/v1/user/user/reset-password responded with "Got user by ID successfully" `);
    return res.status(201).json({ result: user, message: 'Password changed successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/user/reset-password responded with user not found `);
    return res.status(500).json({ error: error, message: 'User not found' });
  }
};

//@desc DELETE User Info API
//@route DELETE user/delete/:id
//@access Private
const deleteUser = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const id = req.params.id;

  try {
    const user = await User.findOneAndUpdate({ _id: id }, { is_delete: true }, { new: true });

    if (!user) {
      logger.error(`${ip}: API /api/v1/user/delete/:id responded with "User not found" `);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`${ip}: API /api/v1/user/delete/:id responded with "User deleted successfully" `);
    return res.status(200).json({ result: user, message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/delete/:id responded with error: ${error.message}`);
    return res.status(500).json({ error: error, message: 'Internal server error' });
  }
};

//@desc RESTORE User Info API
//@route PUT user/restore/:id
//@access Private
const restoreUser = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const id = req.params.id;

  try {
    const user = await User.findOneAndUpdate({ _id: id }, { is_delete: false }, { new: true });

    if (!user) {
      logger.error(`${ip}: API /api/v1/user/restore/:id responded with "User not found" `);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`${ip}: API /api/v1/user/restore/:id responded with "User restored successfully" `);
    return res.status(200).json({ result: user, message: 'User restored successfully' });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/restore/:id responded with error: ${error.message}`);
    return res.status(500).json({ error: error, message: 'Internal server error' });
  }
};

module.exports = {
  testUserAPI,

  createSuperAdmin,
  createUser,
  logIn,

  resetPassword,
  updateRoleType,
  updateUser,
  deleteUser,
  restoreUser,

  getCurrentUser,
  getUserById,
  getUsersByName,
  getAllUsers,
  getPickupPersonsByStorageLocationId
};
