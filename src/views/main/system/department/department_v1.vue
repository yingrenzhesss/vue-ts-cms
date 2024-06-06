<template>
  <div class="department">
    <page-search @query-click="handleQueryClick" @reset-click="handleResetClick" />
    <page-content ref="contentRef" @new-click="handleNewClick" @edit-click="handleEditClick" />
    <page-modal ref="modalRef" />
  </div>
</template>

<script setup lang="ts" name="department">
import pageSearch from './c-cpns/page-search.vue'
import pageContent from './c-cpns/page-content.vue'
import PageModal from './c-cpns/page-modal.vue'
import { ref } from 'vue'

// 点击了search，进行content的操作
const contentRef = ref<InstanceType<typeof pageContent>>()
function handleQueryClick(queryInfo: any) {
  contentRef.value?.fecthPageListData(queryInfo)
}
function handleResetClick() {
  contentRef.value?.fecthPageListData()
}
// 点击content，modal操作
const modalRef = ref<InstanceType<typeof PageModal>>()
function handleNewClick() {
  modalRef.value?.setModalVisible()
}
function handleEditClick(itemData: any) {
  modalRef.value?.setModalVisible(false, itemData)
}
</script>

<style scoped>
/* .department {
} */
</style>
