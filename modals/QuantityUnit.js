const mongoose = require('mongoose');

const quantityUnitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
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

module.exports = mongoose.model('Quantity_unit', quantityUnitSchema);
