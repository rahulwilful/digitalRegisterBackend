const mongoose = require('mongoose');
const StorageLocation = require('./StorageLocation.js');
const Item = require('./Item.js');
const User = require('./User.js');

const { Schema } = mongoose;

const Items = new Schema({
  item_id: {
    type: 'ObjectId',
    ref: 'Item',
    required: true
  },

  quantity: {
    type: Number,
    required: true
  }
});

const WareHouseRegisterShema = new Schema(
  {
    storage_location_id: {
      type: 'ObjectId',
      ref: 'StorageLocation',
      required: true
    },
    warehouse_admin: {
      type: 'ObjectId',
      ref: 'User',
      required: true
    },
    pickup_person: {
      type: 'ObjectId',
      ref: 'User',
      required: true
    },
    item_list: [Items],
    pickup_or_drop: {
      type: String,
      required: true,
      default: 'pickup'
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

module.exports = mongoose.model('warehouse_register', WareHouseRegisterShema);
