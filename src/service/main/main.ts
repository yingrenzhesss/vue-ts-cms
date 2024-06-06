import myRequest from '..'
// 获取所有角色
export function getEntireRoles() {
  return myRequest.post({
    url: '/role/list'
  })
}
// 获取所有部门
export function getEntireDepartments() {
  return myRequest.post({
    url: '/department/list'
  })
}
// 获取所有菜单
export function getEntireMenus() {
  return myRequest.post({
    url: '/menu/list'
  })
}
// 获取所有权限
