import request from '@/utils/request'
// 渠道码API

// 商品类目
export function record(query) {
  return request({
    url: '/buryingPointService/record',
    method: 'post',
    data: query
  })
}
