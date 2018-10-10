import request from '@/utils/request'

// 获取企业子账户列表
export function findSubAccountList(data) {
  return request({
    url: '/subAccountService/findSubAccountList',
    method: 'post',
    data
  })
}

// 修改子账户信息
export function updateSubAccount(data) {
  return request({
    url: '/subAccountService/updateSubAccount',
    method: 'post',
    data
  })
}

// 根据账户id查询角色和菜单权限列表
export function findRoleAndMenuListByAccountId(data) {
  return request({
    url: '/subAccountService/findRoleAndMenuListByAccountId',
    method: 'post',
    data
  })
}

// 修改子账户啊权限信息
export function updatePermission(data) {
  return request({
    url: '/subAccountService/updatePermission',
    method: 'post',
    data
  })
}

// 创建保存子账户啊权限信息
export function saveSubAccount(data) {
  return request({
    url: '/subAccountService/saveSubAccount',
    method: 'post',
    data
  })
}

// 获取创建子账户啊权限信息
export function findAllRoleAndMenuList(data) {
  return request({
    url: '/subAccountService/findAllRoleAndMenuList',
    method: 'post',
    data
  })
}
