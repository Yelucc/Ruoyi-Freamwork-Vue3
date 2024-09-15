import request from '@/utils/request'

// 查询用户管理列表
export function listKhuser(query) {
  return request({
    url: '/KuiHua/khuser/list',
    method: 'get',
    params: query
  })
}

// 查询用户管理详细
export function getKhuser(userId) {
  return request({
    url: '/KuiHua/khuser/' + userId,
    method: 'get'
  })
}

// 新增用户管理
export function addKhuser(data) {
  return request({
    url: '/KuiHua/khuser',
    method: 'post',
    data: data
  })
}

// 修改用户管理
export function updateKhuser(data) {
  return request({
    url: '/KuiHua/khuser',
    method: 'put',
    data: data
  })
}

// 删除用户管理
export function delKhuser(userId) {
  return request({
    url: '/KuiHua/khuser/' + userId,
    method: 'delete'
  })
}
