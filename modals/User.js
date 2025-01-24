const mongoose = require('mongoose');

const Role_type = require('./RoleType.js');
const StorageLocation = require('./StorageLocation.js');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    storage_location_id: {
      type: 'ObjectId',
      ref: 'StorageLocation',
      default: null
    },
    role_type: {
      type: 'ObjectId',
      ref: 'Role_type',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    mobile_no: {
      type: Number,
      required: true
    },

    active: {
      type: Boolean,
      default: true
    },
    is_delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
