const express = require('express');
const router = express.Router();
const User = require('../models/user');
require('../util/util');


/* 登录 */
router.post('/login', (req, res, next) => {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  User.findOne(param, (err, doc) => {
    if(err) {
      res.json({
        status: '1',
        message: err.message,
        success: false
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000*60*60
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000*60*60
        });
        res.json({
          status: '0',
          message: '请求成功',
          success: true,
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
});

/* 登出 */
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    message: '请求成功',
    success: true,
    result: ''
  })
});

/* 登录校验 */
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      success: true,
      message: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      success: false,
      message: '未登录',
      result: ''
    })
  }
})

/* 获取购物车列表接口 */
router.get('/cartList', (req, res, next) => {
  let userID = req.cookies.userId
  User.findOne({userId: userID}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          message: '请求成功',
          success: true,
          result: {
            count: doc.cartList.length,
            list: doc.cartList
          }
        })
      }
    }
  })
});

/* 获取购物车商品数量 */
router.get('/cartCount', (req, res, next) => {
  if(req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId
  }
  User.findOne({'userId': userId}, (err,doc) => {
    if(err) {
      res.json({
        status: '1',
        message: err.message,
        success: false
      })
    } else {
      if(doc) {
        let count = 0
        doc.cartList.map(item => {
          count += item.productNum
        })
        res.json({
          status: '0',
          message: '请求成功',
          success: true,
          result: {
            cartCount: count
          }
        })
      }
    }
  })
});


/* 购物车删除商品 */
router.post('/cartDel', (req, res, next) => {
  let userID = req.cookies.userId, productId = req.body.productId
  User.update({
    userId: userID
  },{
    $pull: {
      cartList: {
        productId: productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        message: '删除成功',
        success: true,
        result: ''
      })
    }
  })
});

/* 购物车商品数量编辑 */
router.post('/cartEdit', (req, res, next) => {
  let userID = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked
  User.update({
    'userId': userID, 'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked,
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        message: '修改成功',
        success: true,
        result: ''
      })
    }
  })
});

/* 购物车商品全选 */
router.post('/cartCheckAll', (req, res, next) => {
  let userId = req.cookies.userId,
      checkAll = req.body.checkAll
  User.findOne({'userId': userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll
        })
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              message: err1.message,
              success: false,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              message: '修改成功',
              success: true,
              result: ''
            })
          }
        })
      }
    }
  })
});

/* 查询地址列表 */
router.get('/addressList', (req, res, next) => {
  let userId = req.cookies.userId
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err1.message,
        success: false,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          message: '获取地址列表成功',
          success: true,
          result: {
            count: doc.﻿addressList.length,
            list: doc.﻿addressList
          }
        })
      }
    }
  })
});

//设置默认地址
router.post('/setDefault', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId
  if (!addressId) {
    res.json({
      status: '1000002',
      message: 'The addressId is null',
      success: false,
      result: ''
    })
  } else {
    User.findOne({'userId': userId}, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          message: err.message,
          success: false,
          result: ''
        })
      } else {
        if (doc) {
          let addressList = doc.﻿addressList;
          addressList.forEach((item) => {
            if (item.addressId === addressId) item.﻿isDefault = true
            else item.﻿isDefault = false
          });
          doc.save((err1, doc1) => {
            if (err1) {
              res.json({
                status: '1',
                message: err1.message,
                success: false,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                message: '设置成功',
                success: true,
                result: ''
              })
            }
          })
        }
      }
    });
  }
});

//删除地址接口
router.post('/delAddress', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false,
        result: ''
      })
    } else {
      if (doc) {
        let addressList = doc.﻿addressList;
        addressList.forEach((item, index) => {
          if (item.addressId === addressId) {
            addressList.splice(index, 1)
          }
        });
        doc.save((err1, doc1) => {
          if (err1) {
            res.json({
              status: '1',
              message: err1.message,
              success: false,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              message: '删除成功',
              success: true,
              result: ''
            })
          }
        })
      }
    }
  })
});

//生成订单接口
router.post('/payment', (req, res, next) => {
  let userId = req.cookies.userId,
    addressId = req.body.addressId,
    shipping = req.body.shipping,
    discount = req.body.discount,
    tax = req.body.tax,
    orderTotal = req.body.orderTotal
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false,
        result: ''
      })
    } else {
      //获取当前用户地址信息
      let address = {}
      doc.addressList.forEach(item => {
        if(item.addressId === addressId)
          address = item
      })
      //获取当前用户购物车商品列表
      let goodList = []
      doc.cartList.filter((item,index) => {
        if(item.checked){
          goodList.push(item)
        }
      });
      //创建订单号
      let platform = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)

      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

      let orderId = platform + r1 + sysDate + r2
      let order = {
        orderId: orderId,
        shipping: shipping,
        discount: discount,
        tax: tax,
        orderTotal: orderTotal,
        addressInfo: address,
        goodList: goodList,
        orderStatus: true,
        createDate: createDate
      }
      doc.orderList.push(order)
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            message: err1.message,
            success: false,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            message: '创建成功',
            success: true,
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
});
module.exports = router;
