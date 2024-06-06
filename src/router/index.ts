import { LOGIN_TOKEN } from '@/global/constants'
import { localCache } from '@/utils/cache'
import { firstMenu } from '@/utils/map-menus'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/main/main.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login.vue')
    },
    {
      path: '/:patchMactch(.*)',
      component: () => import('../views/not-found/NotFound.vue')
    }
  ]
})

// 导航守卫
// 返回值决定导航的路径，不返回或者返回undefine则默认跳转
// 举个例子： / => /main
// 即to: /main from: /,返回值/abc，则最后去/abc
// 不过一般都是有判断的
router.beforeEach((to) => {
  // 只有登录成功(token)，才可到/main页面
  const token = localCache.getCache(LOGIN_TOKEN)
  if (to.path.startsWith('/main') && !token) {
    return '/login'
  }
  // 如果是进入main
  if (to.path === '/main') {
    return firstMenu?.url
  }
})

export default router
