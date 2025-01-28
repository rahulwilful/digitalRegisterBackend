const mongoose = require('mongoose');
const StorageLocation = require('./StorageLocation.js');
const Quantity_unit = require('./QuantityUnit.js');

const { Schema } = mongoose;

const ItemShema = new Schema(
  {
    item_name: {
      type: String,
      required: true,
      unique: true
    },
    quantity_unit: {
      /*   type: String, */
      type: 'ObjectId',
      ref: 'Quantity_unit',
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

module.exports = mongoose.model('Item', ItemShema);
