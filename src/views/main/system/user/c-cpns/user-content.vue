<template>
  <div class="content">
    <div class="header">
      <h3 class="title">用户列表</h3>
      <el-button v-if="isCreate" type="primary" size="large" @click="handleNewUserClick"
        >新建用户</el-button
      >
    </div>
    <div class="table">
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column align="" type="selection" width="50" />
        <el-table-column align="center" type="index" label="序号" width="60" />

        <el-table-column align="center" prop="name" label="用户名" width="150" />
        <el-table-column align="center" prop="realname" label="真实姓名" width="150" />
        <el-table-column align="center" prop="cellphone" label="电话号码" width="150" />
        <el-table-column align="center" prop="enable" label="状态" width="100">
          <!-- 作用域插槽 -->
          <template #default="scope">
            <el-button size="small" plain :type="scope.row.enable ? 'primary' : 'danger'">
              {{ scope.row.enable ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createAt" label="创建时间">
          <template #default="scope">
            {{ formatUTC(scope.row.createAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateAt" label="更新时间">
          <template #default="scope">
            {{ formatUTC(scope.row.updateAt) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template #default="scope">
            <el-button
              v-if="isUpdate"
              size="small"
              icon="Edit"
              type="primary"
              text
              @click="handleEditBtnClick(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="isDelete"
              size="small"
              icon="Delete"
              type="danger"
              text
              @click="handleUserDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useSystemStore from '@/store/main/system/system'
import { storeToRefs } from 'pinia'
import { formatUTC } from '@/utils/format'
import { ref } from 'vue'
import usePermissions from '@/hooks/usePermissions'

// 按钮权限控制
const isCreate = usePermissions('users:create')
const isDelete = usePermissions('users:delete')
const isUpdate = usePermissions('users:update')
const isQuery = usePermissions('users:query')

// 发起自定义事件
const emit = defineEmits(['newClick', 'editClick'])
// 1.发起action，请求usersList数据
const systemStore = useSystemStore()
const currentPage = ref(1)
const pageSize = ref(10)
fecthUserListData()
// 2.将usersList数据进行展示
const { usersList, usersTotalCount } = storeToRefs(systemStore)
// 3.页码相关的逻辑
function handleSizeChange() {
  fecthUserListData()
}
function handleCurrentChange() {
  fecthUserListData()
}
// 4.定义函数用于发送网络请求
function fecthUserListData(formData: any = {}) {
  if (!isQuery) return
  // 1.获取offset和size
  const size = pageSize.value
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }
  // 2.发起网络请求
  const queryInfo = { ...pageInfo, ...formData }
  systemStore.postUserListAction(queryInfo)
}

// 5.删除用户
function handleUserDelete(id: number) {
  systemStore.deleteUserByIdAction(id)
}
// 6.新建用户功能
function handleNewUserClick() {
  emit('newClick')
}
// 7.编辑用户
function handleEditBtnClick(itemData: any) {
  emit('editClick', itemData)
}
// 暴露请求给父组件user
defineExpose({ fecthUserListData })
</script>

<style lang="less" scoped>
.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;

  .title {
    font-size: 22px;
  }
}

.table {
  :deep(.el-table__cell) {
    padding: 12px 0;
  }
  .el-button {
    margin-left: 0;
    padding: 5px 8px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
