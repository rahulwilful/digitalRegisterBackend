const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validateToken = require('../middleWare/validateToken.js');
const { createUser, createSuperAdmin, getAllUsers, getUsersByName, getCurrentUser, deleteUser, restoreUser, getUserById, getPickupPersonsByStorageLocationId, logIn, resetPassword, testUserAPI, updateRoleType, updateUser } = require('../controllers/user');

//@desc Create User API
//@route POST user/create
//@access Public
router.post(
  '/create',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('mobile_no', 'Enter a Valid Whatsapp Number').notEmpty().isNumeric(),
    body('password', 'Password must have atlest 5 character').isLength({
      min: 5
    }),
    body('role_type'),
    body('storage_location_id')
  ],
  validateToken,
  createUser
);

//@desc Create User API
//@route POST user/create/super/admin
//@access Public
router.post(
  '/create/super/admin',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('mobile_no', 'Enter a Valid Whatsapp Number').notEmpty().isNumeric(),
    body('password', 'Password must have atlest 5 character').isLength({
      min: 5
    }),
    body('storage_location_id')
  ],
  createSuperAdmin
);

//@desc LogIn User API
//@route post user/login
//@access Public
router.post(
  '/login',
  [
    body('email', 'Enter Valid Email').isEmail(),
    body('password', 'Password Is Incorrect').isLength({
      min: 5
    })
  ],
  logIn
);

//@desc Create User API
//@route POST user/updaterole_type/:id
//@access Private
router.post('/updaterole_type/:id', [body('role_type')], validateToken, updateRoleType);

//@desc Create User API
//@route POST user/updateuser/:id
//@access Private
router.put('/update/:id', [body('name', 'Enter a valid name').isLength({ min: 3 }), body('email', 'Enter a Valid Email').isEmail(), body('mobile_no', 'Enter a Valid Whatsapp Number').notEmpty().isNumeric(), body('role_type', 'Enter a valid role_type').isLength({ min: 3 }), body('storage_location_id', 'Enter a valid storage_location_id').isLength({ min: 3 })], validateToken, updateUser);

//@desc Create User API
//@route POST user/reset-password
//@access Public
router.post('/reset/password', [body('old_password', 'Enter a valid password').isLength({ min: 5 }), body('password', 'Enter a valid password').isLength({ min: 5 }), body('email', 'Enter a Valid Email').isEmail()], resetPassword);

//@desc Get User Info API
//@route post user/get/:id
//@access Private
router.get('/get/:id', validateToken, getUserById);

//@desc Get User Info API
//@route post user/delete/:id
//@access Private
router.delete('/delete/:id', validateToken, deleteUser);

//@desc RESTORE User Info API
//@route PUT user/restore/:id
//@access Private
router.put('/restore/:id', validateToken, restoreUser);

//@desc Get Users By Name API
//@route POST user/get/by/name
//@access Private
router.post('/get/by/name', [body('name').isLength({ min: 1 })], validateToken, getUsersByName);

//@desc Get Users By Storage Location ID API
//@route post user/get/pickup-persons-by-storage-location/:id
//@access Private
router.get('/get/pickup-persons-by-storage-location/:id', validateToken, getPickupPersonsByStorageLocationId);

//@desc Test User API
//@route GET /api/v1/user
//@access Private
router.get('/', testUserAPI);

//@desc Test User API
//@route GET /getalluser
//@access Private
router.get('/getall', validateToken, getAllUsers);

//@desc Get Current User API
//@route GET /user
//@access Private
router.get('/getcurrentuser', validateToken, getCurrentUser);

module.exports = router;
