const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  ﻿userId: String,
  ﻿userName: String,
  ﻿userPwd: String,
  orderList: Array,
  addressList: [{
    ﻿addressId: String,
    ﻿userName: String,
    ﻿streetName: String,
    ﻿postCode: String,
    ﻿tel: String,
    ﻿isDefault: Boolean
}],
  cartList: [{
    ﻿productId: String,
    productName: String,
    salePrice: Number,
    productImage: String,
    productNum: Number,
    checked: Boolean
  }]
});

module.exports = mongoose.model('User', userSchema);