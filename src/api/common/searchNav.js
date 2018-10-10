import request from '@/utils/request'
// 首页

// 商品类目
export function queryContent(query) {
  return request({
    url: '/categoryService/queryCategoryList',
    method: 'post',
    data: query
  })
}
// 获取购物车数量
export function getCarNum(query) {
  return request({
    url: 'mallCartService/selectCartCountByUserId',
    method: 'post',
    data: query
  })
}
