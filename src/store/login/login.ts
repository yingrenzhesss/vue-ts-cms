import router from '@/router'
import { defineStore } from 'pinia'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'
import { LOGIN_TOKEN } from '@/global/constants'

import { accountLoginRequest, getUserInfoById, getUserMenusByRoleId } from '@/service/login/login'
import { mapMenusToPermissions, mapMenusToRoutes } from '@/utils/map-menus'
import useMainStore from '../main/main'

interface ILoginState {
  token: string
  userInfo: any
  userMenus: any
  permissions: any[]
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: '',
    userInfo: {},
    userMenus: [],
    permissions: []
  }),
  actions: {
    async loginAccountAction(account: IAccount) {
      // 1.帐号登录，并请求token
      const loginRes = await accountLoginRequest(account)
      const id = loginRes.data.id
      // const name = loginRes.data.name
      this.token = loginRes.data.token

      // 2.本地缓存token
      localCache.setCache(LOGIN_TOKEN, this.token)

      // 3.请求登录用户的详细信息(role信息)
      const userInfoResult = await getUserInfoById(id)
      const userInfo = userInfoResult.data
      this.userInfo = userInfo
      // console.log(this.userInfo.role)
      // 4.根据角色请求登录用户的权限（菜单树）
      const userMenusResult = await getUserMenusByRoleId(this.userInfo.role.id)
      const userMenus = userMenusResult.data
      this.userMenus = userMenus
      // 5.进行本地缓存
      localCache.setCache('userInfo', userInfo)
      localCache.setCache('userMenus', userMenus)

      // 6.登陆成功请求所有的roles/department
      const mainStore = useMainStore()
      mainStore.fecthEntireDataAction()

      // 重要: 添加按钮权限
      const permissions = mapMenusToPermissions(userMenus)
      this.permissions = permissions

      // 重要： 动态添加路由
      const routes = mapMenusToRoutes(userMenus)
      routes.forEach((route) => router.addRoute('main', route))
      // 页面跳转
      router.push('/main')
    },

    // 处理用户页面刷新时数据缓存
    loadLocalCacheAction() {
      // 1.用户在main页面近行刷新默认加载路由
      const token = localCache.getCache(LOGIN_TOKEN)
      const userInfo = localCache.getCache('userInfo')
      const userMenus = localCache.getCache('userMenus')
      if (token && userInfo && userMenus) {
        this.token = token
        this.userInfo = userInfo
        this.userMenus = userMenus

        // 2.刷新时重新请求最新的roles/department
        const mainStore = useMainStore()
        mainStore.fecthEntireDataAction()

        // 3.刷新时重新添加按钮权限
        const permissions = mapMenusToPermissions(userMenus)
        this.permissions = permissions

        // 4.刷新时重新动态加载路由
        const routes = mapMenusToRoutes(userMenus)
        routes.forEach((route) => router.addRoute('main', route))
      }
    }
  }
})

export default useLoginStore
