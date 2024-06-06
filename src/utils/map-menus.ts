import type { RouteRecordRaw } from 'vue-router'

function loadLocalRoutes() {
  // 1.动态获取所有的路由对象并放到数组里
  // 路由对象已经都放在本地文件中
  //  从本地文件中将所有路由对象先读取到数组中
  const localRoutes: RouteRecordRaw[] = []
  // 1.1 读取router/main所有的ts文件(路由映射)
  const files: Record<string, any> = import.meta.glob(
    '../router/main/**/*.ts',
    { eager: true } //eager直接获取对象映射
  )

  // 1.2 将加载的对象放到localRoutes
  for (const key in files) {
    const module = files[key]
    localRoutes.push(module.default)
  }

  return localRoutes
}
// 进入main页面第一个路由
export let firstMenu: any = null
// 加载登录用户的路由映射
export function mapMenusToRoutes(userMenus: any[]) {
  // 1.加载本地路由
  const localRoutes = loadLocalRoutes()
  // 2.根据后端返回的菜单userMenus匹配正确的路由
  const routes: RouteRecordRaw[] = []
  for (const menu of userMenus) {
    for (const subMenu of menu.children) {
      const route = localRoutes.find((item) => item.path === subMenu.url)
      if (route) {
        // 2.1 给route的顶层菜单增加重定向功能（只需要加一次）
        if (!routes.find((item) => item.path === menu.url)) {
          routes.push({ path: menu.url, redirect: route.path })
        }
        routes.push(route)
      }
      // 3.记录第一个被匹配的路由
      if (!firstMenu && route) firstMenu = subMenu
    }
  }
  return routes
}
/**
 * 根据路径去匹配需要显示的侧边栏菜单（刷新时依然是当前菜单）
 * @param path 需要匹配的路径
 * @param userMenu 所有的菜单
 */
export function mapPathToMenu(path: string, userMenus: any[]) {
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      if (submenu.url === path) {
        return submenu
      }
    }
  }
}

// 面包屑的导出
interface IBreadcrumb {
  name: string
  path: string
}
export function mapPathToBreadcrumbs(path: string, userMenus: any[]) {
  // 1.定义面包屑，每当运行此函数就会重置breadcrumbs
  const breadcrumbs: IBreadcrumb[] = []
  // 2.遍历获取的面包屑层级(后端有提供)
  for (const menu of userMenus) {
    for (const submenu of menu.children) {
      if (submenu.url === path) {
        // 因为是用当前页面的url匹配，所以只会加入当前页面的面包屑
        breadcrumbs.push({ name: menu.name, path: menu.url })
        breadcrumbs.push({ name: submenu.name, path: submenu.url })
      }
    }
  }
  return breadcrumbs
}

/**
 * 菜单映射到id的列表
 * @param menuList
 */
export function mapMenuListToIds(menuList: any[]) {
  const ids: number[] = []

  function recurseGetId(menus: any[]) {
    for (const item of menus) {
      if (item.children) {
        recurseGetId(item.children)
      } else {
        ids.push(item.id)
      }
    }
  }
  recurseGetId(menuList)

  return ids
}

/**
 *从菜单映射到按钮的权限
 * @param menus 菜单列表
 * @returns 权限的数组(字符串数组) -->'system:users:create'
 */
export function mapMenusToPermissions(menuList: any[]) {
  const permissions: string[] = []

  function recurseGetPermissions(menus: any[]) {
    for (const item of menus) {
      if (item.type === 3) {
        //等于3是因为后端把按钮权限放在第3级
        permissions.push(item.permission)
      } else {
        recurseGetPermissions(item.children ?? [])
      }
    }
  }
  recurseGetPermissions(menuList)

  return permissions
}
