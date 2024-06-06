<template>
  <div class="panel-account">
    <el-form
      label-width="60px"
      size="large"
      :model="account"
      :rules="accountRules"
      status-icon
      ref="formRef"
    >
      <el-form-item label="账号" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="account.password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormRules, ElForm } from 'element-plus'
// import { accountLoginRequest } from '@/service/login/login'
import useLoginStore from '@/store/login/login'

import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache'

const CACHE_NAME = 'name'
const CACHE_PASSWORD = 'password'

// 1.定义account数据
const account = reactive<IAccount>({
  name: localCache.getCache(CACHE_NAME) ?? '',
  password: localCache.getCache(CACHE_PASSWORD) ?? ''
})
// 2.定义校验规则
const accountRules: FormRules = {
  name: [
    { required: true, message: '请输入账号信息~', trigger: 'blur' },
    // { min: 6, max: 12, message: '账号长度为6-12位', trigger: 'change' },
    {
      pattern: /^[a-zA-Z0-9_]{6,20}$/,
      message: '必须是6~20字母、数字和下划线组成~',
      trigger: 'change'
    }
  ],
  password: [
    { required: true, message: '请输入密码~', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{3,}$/,
      message: '必须是3位以上字母、数字组成~',
      trigger: 'change'
    }
  ]
}

// 3.执行账号登录逻辑
const formRef = ref<InstanceType<typeof ElForm>>()
const loginStore = useLoginStore()
function loginAction(isRemPwd: boolean) {
  formRef.value?.validate((valid) => {
    if (valid) {
      // 3.1获取用户输入的帐号和密码
      const name = account.name
      const password = account.password

      // 3.2向服务器发送网络请求（携带帐号密码）
      loginStore.loginAccountAction({ name, password }).then(() => {
        // 3.3判断是否要记住密码
        if (isRemPwd) {
          localCache.setCache(CACHE_NAME, name)
          localCache.setCache(CACHE_PASSWORD, password)
        } else {
          //没有点击记住密码则删除本地缓存
          localCache.removeCache(CACHE_NAME)
          localCache.removeCache(CACHE_PASSWORD)
        }
      })
    } else {
      ElMessage.error('登录失败,请输入正确的格式~')
    }
  })
}

defineExpose({
  loginAction
})
</script>

<style lang="less" scoped>
.panel-account {
  color: red;
}
</style>
