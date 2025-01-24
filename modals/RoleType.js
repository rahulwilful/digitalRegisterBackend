const mongoose = require('mongoose');

const { Schema } = mongoose;

const Role_typeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Role_type', Role_typeSchema);
