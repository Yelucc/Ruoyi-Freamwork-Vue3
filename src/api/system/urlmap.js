import request from '@/utils/request'

// 查询短链映射列表
export function listUrlmap(query) {
  return request({
    url: '/system/urlmap/list',
    method: 'get',
    params: query
  })
}

// 查询短链映射详细
export function getUrlmap(shortUrl) {
  return request({
    url: '/system/urlmap/' + shortUrl,
    method: 'get'
  })
}

// 新增短链映射
export function addUrlmap(data) {
  return request({
    url: '/system/urlmap',
    method: 'post',
    data: data
  })
}

// 修改短链映射
export function updateUrlmap(data) {
  return request({
    url: '/system/urlmap',
    method: 'put',
    data: data
  })
}

// 删除短链映射
export function delUrlmap(shortUrl) {
  return request({
    url: '/system/urlmap/' + shortUrl,
    method: 'delete'
  })
}
