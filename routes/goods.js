const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const Users = require('./../models/user');

//连接mongodb数据库
mongoose.connect('mongodb://imooc:123456@116.85.36.172/imooc');
mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success');
});

mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail');
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected');
});

//查询商品列表
router.get('/list', (req, res, next) => {
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let priceLevel = req.param('priceLevel');
  let params = {};
  let priceGt = '',priceLte = '';
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':priceGt = 0;priceLte = 500;break;
      case '1':priceGt = 500;priceLte = 1000;break;
      case '2':priceGt = 1000;priceLte = 5000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let skip = (page - 1) * pageSize;
  let sort = req.param('sort');
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({﻿salePrice:sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false
      })
    } else {
      res.json({
        status: '0',
        message: '请求成功',
        success: true,
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

//加入到购物车
router.post('/addCart', (req, res, next) => {
  let ﻿productId = req.body.﻿productId;
  let userID = req.cookies.userId
  Users.findOne({'userId': userID}, (err, userDoc ) => {
    if (err) {
      res.json({
        status: '1',
        message: err.message,
        success: false
      })
    } else {
      if (userDoc) {
        let goodsItem = ''
        userDoc.cartList.forEach(item => {
          if (item.productId === productId) {
            goodsItem = item
            item.productNum ++
            item.checked = true
          }
        })
        if (goodsItem) {
          userDoc.save((err2,doc2) => {
            if(err2) {
              res.json({
                status: '1',
                message: err2.message,
                success: false
              })
            } else {
              res.json({
                status: '0',
                message: '请求成功',
                success: true,
                result: ''
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, (err1,doc1) => {
            if (err1) {
              res.json({
                status: '1',
                message: err1.message,
                success: false
              })
            } else {
              if (doc1) {
                doc1.﻿productNum = 1;
                doc1.checked = true;
                userDoc.cartList.push(doc1);
                userDoc.save((err2,doc2) => {
                  if(err2) {
                    res.json({
                      status: '1',
                      message: err2.message,
                      success: false
                    })
                  } else {
                    res.json({
                      status: '0',
                      message: '请求成功',
                      success: true,
                      result: ''
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
});

module.exports = router;
