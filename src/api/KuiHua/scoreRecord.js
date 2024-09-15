import request from '@/utils/request'

// 查询葵花分数记录列表
export function listScoreRecord(query) {
  return request({
    url: '/KuiHua/scoreRecord/list',
    method: 'get',
    params: query
  })
}

// 查询葵花分数记录详细
export function getScoreRecord(recordId) {
  return request({
    url: '/KuiHua/scoreRecord/' + recordId,
    method: 'get'
  })
}

// 新增葵花分数记录
export function addScoreRecord(data) {
  return request({
    url: '/KuiHua/scoreRecord',
    method: 'post',
    data: data
  })
}

// 修改葵花分数记录
export function updateScoreRecord(data) {
  return request({
    url: '/KuiHua/scoreRecord',
    method: 'put',
    data: data
  })
}

// 删除葵花分数记录
export function delScoreRecord(recordId) {
  return request({
    url: '/KuiHua/scoreRecord/' + recordId,
    method: 'delete'
  })
}
