import request from '@/utils/request'
// 商品快照详情页
export function getItemSnapshotInfo(query) {
  return request({
    url: '/snapshotService/getItemSnapshot',
    method: 'post',
    data: query
  })
}
