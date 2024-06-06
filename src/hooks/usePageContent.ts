import { ref } from 'vue'
import type PageContent from '@/components/page-content/page-content.vue'

function usePageContent() {
  const contentRef = ref<InstanceType<typeof PageContent>>()
  function handleQueryClick(queryInfo: any) {
    // console.log(queryInfo)
    contentRef.value?.fecthPageListData(queryInfo)
  }
  function handleResetClick() {
    contentRef.value?.fecthPageListData()
  }

  return {
    contentRef,
    handleQueryClick,
    handleResetClick
  }
}

export default usePageContent
