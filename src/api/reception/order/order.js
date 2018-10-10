import request from '@/utils/request'
// 订单

// 立即下单
export function fetchAddOrder(query) {
  return request({
    url: '/orderService/addOrder',
    method: 'post',
    data: query
  })
}

// 以需求单提交
export function createSalesOrder(query) {
  return request({
    url: '/orderService/createSalesOrder',
    method: 'post',
    data: query
  })
}

// 获取商品详情列表
export function findCurrentItemLineList(query) {
  return request({
    url: '/orderService/findCurrentItemLineList',
    method: 'post',
    data: query
  })
}
