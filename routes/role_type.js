const express = require("express");
const role_typeRouter = express.Router();
const { body } = require("express-validator");
const {
  testRole_typeAPI,
  getAllRole_types,
  getRole_typeByName,
  addRole,
} = require("../controllers/role_type");
const ValidateToken = require("../middleWare/validateToken");

//@desc Test Role_type API
//@route GET /api/v1/role_type
//@access Public
role_typeRouter.get("/", testRole_typeAPI);

//@desc Get Role_type By Name API
//@route GET /api/v1/role_type/add
//@access Private
role_typeRouter.post(
  "/add",
  [
    body("name", "Enter Valid Name").notEmpty(),
    body("value", "Enter Valid Value").notEmpty(),
  ],
  addRole
);

//@desc Get All Role_types API
//@route GET /api/v1/role_type/getallrole_types
//@access Private
role_typeRouter.get("/getall", getAllRole_types);

//@desc Get Role_type By Name API
//@route GET /api/v1/role_type/getrole_typebyname
//@access Private
role_typeRouter.get(
  "/getrole_typebyname",
  [body("name", "Enter Valid Name").notEmpty()],
  getRole_typeByName
);

module.exports = role_typeRouter;
