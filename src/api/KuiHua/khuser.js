import request from '@/utils/request'
// 葵花用户注册
export function khRegister(data) {
  return request({
    url: '/KuiHua/khuser/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
export function khLogin(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/KuiHua/khuser/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

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
