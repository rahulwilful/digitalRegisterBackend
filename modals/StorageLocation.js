const mongoose = require('mongoose');

const { Schema } = mongoose;

const StorageLocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: null
    },
    address: {
      type: String,
      required: true
    },
    pin_code: {
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

module.exports = mongoose.model('StorageLocation', StorageLocationSchema);
