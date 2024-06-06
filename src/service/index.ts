import { localCache } from '@/utils/cache'
import { BASE_URL, TIME_OUT } from './config'
import MYRequest from './request'
import { LOGIN_TOKEN } from '@/global/constants'

const myRequest = new MYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      // 使用拦截器让每个请求都添加token
      const token = localCache.getCache(LOGIN_TOKEN)
      if (config.headers && token) {
        // 类型缩小
        config.headers.Authorization = 'Bearer ' + token
      }
      return config
    }
  }
})

export default myRequest
