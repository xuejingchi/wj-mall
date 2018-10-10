'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
},{
  // RAP
  // BASE_API: '"http://192.168.5.220:8080/mockjsdata/35/api"'
  // 测试地址
  // BASE_API: '"http://192.168.5.200:9090/api"'
  // 刘昱宏
  // BASE_API: '"http://172.16.19.166:9090/api"'
  // 李杰
  // BASE_API: '"http://172.16.19.75:9090/api"'
  // 丁杰
  // BASE_API: '"http://172.16.32.108:9090/api"'
  // 方超
  // BASE_API: '"http://172.16.19.175/api"'
  // 赵攀峰
  // BASE_API: '"http://172.16.19.114:9090/api"'
  // 时峰
  BASE_API: '"http://172.16.32.58:9090/api"'
  // 沈佳庆
  // BASE_API: '"http://172.16.19.97:9090/api"'
  // 李国清
  // BASE_API: '"http://172.16.19.82:9090/api"'
  // 俞应兴
  // BASE_API: '"http://172.16.18.237:9090/api"'
});
