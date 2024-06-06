import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { MYRequestConfig } from './type'

// 连接器Loading/token/修改配置
/**
 * 两个难点
 * ..1.拦截器的处理
 * ....> 全局拦截器
 *.....> 实例拦截器
 *.....> 单词请求拦截器

 * ..2.响应结果的类型处理 (泛型)
 */

class MYRequest {
  instance: AxiosInstance

  // request实例 => axios实例
  constructor(config: MYRequestConfig) {
    this.instance = axios.create(config)

    // 1.给每个instance实例添加全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 此处添加其他额外操作--loading/token
        return config
      },
      (err) => {
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        return err
      }
    )

    // 2.针对特定的myRequest实例添加拦截器
    // 此处可以使用类型缩小if (config.interceptoes)，但是源码就有可选属性，所以用？.可选链即可
    // 因为此处可选链结果要么是函数，要么是undefine，而use源码接收四种 函数 | promise | null | undefined
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    )
  }

  // 封装request请求，防止这个第三方库不更新了
  request<T = any>(config: MYRequestConfig<T>) {
    // 3.封装单次请求拦截器（新版本axios需改代码）
    if (config.interceptors?.requestSuccessFn) {
      //单次请求有传拦截器
      config = config.interceptors.requestSuccessFn(config)
    }

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseSuccessFn) {
            //单次请求有传拦截器
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => {
          if (config.interceptors?.responseFailureFn) {
            //单次请求有传拦截器
            err = config.interceptors.responseFailureFn(err)
          }
          reject(err)
        })
    })
  }

  get<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  delete<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default MYRequest
