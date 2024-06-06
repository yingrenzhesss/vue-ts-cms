<template>
  <div class="user">
    <user-search @query-click="handleQueryClick" @reset-click="handleResetClick" />
    <user-content
      ref="contentRef"
      @new-click="handelNewBtnClick"
      @edit-click="handleEditBtnClick"
    />
    <user-modal ref="modalRef" />
  </div>
</template>

<script setup lang="ts" name="user">
import { ref } from 'vue'
import UserSearch from './c-cpns/user-search.vue'
import UserContent from './c-cpns/user-content.vue'
import UserModal from './c-cpns/user-modal.vue'

// 对content组件的操作
const contentRef = ref<InstanceType<typeof UserContent>>()
function handleResetClick() {
  contentRef.value?.fecthUserListData()
}
function handleQueryClick(formData: any) {
  contentRef.value?.fecthUserListData(formData)
}
// 对modal组件的操作
const modalRef = ref<InstanceType<typeof UserModal>>()
function handelNewBtnClick() {
  modalRef.value?.setModalVisible()
}

function handleEditBtnClick(itemData: any) {
  modalRef.value?.setModalVisible(false, itemData)
}
</script>

<style scoped>
.user {
  border-radius: 10px;
  overflow: hidden;
}
</style>
