import myRequest from '..'
import type { IAccount } from '@/types'

// 登录请求
export function accountLoginRequest(account: IAccount) {
  return myRequest.post({
    url: '/login',
    data: account
  })
}

// 请求登录用户的详细信息
export function getUserInfoById(id: number) {
  return myRequest.get({
    url: `/users/${id}`
  })
}

// 请求用户的菜单树
export function getUserMenusByRoleId(id: number) {
  return myRequest.get({
    url: `/role/${id}/menu`
  })
}
