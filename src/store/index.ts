import { createPinia } from 'pinia'
const pinia = createPinia()
import type { App } from 'vue'
import useLoginStore from './login/login'

function registerStore(app: App<Element>) {
  // 1.use pinia
  app.use(pinia)
  // 2.加载本地数据
  const loginStore = useLoginStore()
  loginStore.loadLocalCacheAction()
}

export default registerStore
