const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
  '﻿productId': String,
  '﻿productName': String,
  '﻿salePrice': Number,
  'productNum': Number,
  'checked': Boolean,
  '﻿productImage': String
});

module.exports = mongoose.model('Good', productSchema);