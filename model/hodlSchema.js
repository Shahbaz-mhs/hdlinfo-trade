const mongoose = require("mongoose");
require("../config");

const holdSchema = mongoose.Schema({
  base_unit: {
    type: String,
    required: true,
  },
  last: {
    type: String,
  },
  sell: {
    type: String,
    required: true,
  },
  buy: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
  },
  diff: {
    type: String,
  },
  savings: {
    type: String,
  },
});

const trade = mongoose.model("trade", holdSchema);

module.exports = trade;
