import { getEntireDepartments, getEntireMenus, getEntireRoles } from '@/service/main/main'
import { defineStore } from 'pinia'

interface IMainState {
  entireRoles: any[]
  entireDepartments: any[]
  entireMenus: any[]
}

const useMainStore = defineStore('main', {
  state: (): IMainState => ({
    entireRoles: [],
    entireDepartments: [],
    entireMenus: []
  }),
  actions: {
    async fecthEntireDataAction() {
      const rolesResult = await getEntireRoles()
      const departmentResult = await getEntireDepartments()
      const menuResult = await getEntireMenus()

      //保存数据
      this.entireRoles = rolesResult.data.list
      this.entireDepartments = departmentResult.data.list
      this.entireMenus = menuResult.data.list
    }
  }
})

export default useMainStore
