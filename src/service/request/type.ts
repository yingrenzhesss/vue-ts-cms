// axios版本1.6.8
// import type { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// // 针对AxiosRequestConfig配置进行扩展
// export interface MYInterceptors {
//   // 定制请求拦截器
//   requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
//   requestFailureFn?: (err: any) => any
//   responseSuccessFn?: (res: AxiosResponse) => AxiosResponse
//   responseFailureFn?: (err: any) => any
// }
// // 添加额外属性interceptors
// export interface MYRequestConfig extends AxiosRequestConfig {
//   interceptors?: MYInterceptors
// }

// axios版本0.21.1
import type { AxiosResponse, AxiosRequestConfig } from 'axios'

// 针对AxiosRequestConfig配置进行扩展
export interface MYInterceptors<T = AxiosResponse> {
  // 定制请求拦截器
  requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
}
// 添加额外属性interceptors
export interface MYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: MYInterceptors<T>
}
