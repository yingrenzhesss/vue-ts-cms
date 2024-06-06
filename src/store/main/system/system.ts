import {
  deletePageById,
  deleteUserById,
  editPageData,
  editUserData,
  newPageData,
  newUserData,
  postPageListData,
  postUserListData
} from '@/service/main/system/system'
import { defineStore } from 'pinia'
import type { ISystemState } from './type'
import useMainStore from '../main'

const useSystemStore = defineStore('system', {
  state: (): ISystemState => ({
    usersList: [],
    usersTotalCount: 0,

    pageList: [],
    pageTotalCount: 0
  }),
  actions: {
    async postUserListAction(queryInfo: any) {
      const usersListResult = await postUserListData(queryInfo)
      const { totalCount, list } = usersListResult.data
      this.usersList = list
      this.usersTotalCount = totalCount
      // console.log(usersListResult)
    },
    async deleteUserByIdAction(id: number) {
      // 1.请求删除数据
      // const deleteUserResult = await deleteUserById(id)
      await deleteUserById(id)
      // console.log(deleteUserResult)
      // 2.重新请求数据
      this.postUserListAction({ offset: 0, size: 10 })
    },
    async newUserDataAction(userInfo: any) {
      // 1.创建新的用户
      await newUserData(userInfo)
      // console.log(newResult)
      // 2.创建成功后请求新的数据
      this.postUserListAction({ offset: 0, size: 10 })
    },
    async editUserDataAction(id: number, userInfo: any) {
      // 1.更新用户的数据
      await editUserData(id, userInfo)
      // 2.更新数据后刷新页面
      this.postUserListAction({ offset: 0, size: 10 })
    },
    /**针对页面的数据：增删改查 */
    async postPageListAction(pageName: string, queryInfo: any) {
      const pageListResult = await postPageListData(pageName, queryInfo)
      const { totalCount, list } = pageListResult.data

      this.pageList = list
      this.pageTotalCount = totalCount
    },
    async deletePageByIdAction(pageName: string, id: number) {
      await deletePageById(pageName, id)
      // 删除完重新发送请求
      this.postPageListAction(pageName, { offset: 0, size: 10 })
      // 3.获取完整的数据
      const mainStore = useMainStore()
      mainStore.fecthEntireDataAction()
    },
    async newPageDataAction(pageName: string, pageInfo: any) {
      // 1.新建数据
      await newPageData(pageName, pageInfo)
      this.postPageListAction(pageName, { offset: 0, size: 10 })
      // 3.获取完整的数据
      const mainStore = useMainStore()
      mainStore.fecthEntireDataAction()
    },
    async editPageDataAction(pageName: string, id: number, pageInfo: any) {
      // 1.更新数据
      await editPageData(pageName, id, pageInfo)
      // 2.重新请求数据
      this.postPageListAction(pageName, { offset: 0, size: 10 })
      // 3.获取完整的数据
      const mainStore = useMainStore()
      mainStore.fecthEntireDataAction()
    }
  }
})

export default useSystemStore
