<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { ElButton, ElCheckbox, ElForm, ElFormItem, ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStoreWithOut } from '@/stores/modules/user'

const { t } = useI18n()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-form')

const router = useRouter()

const userStore = useUserStoreWithOut()

interface LoginFormData {
  username: string
  password: string
  remember: boolean
}

const formRef = ref<FormInstance>()

const loading = ref(false)

const formData = reactive<LoginFormData>({
  username: 'admin',
  password: '123456',
  remember: true
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: t('login.usernamePlaceholder'), trigger: 'blur' }],
  password: [
    { required: true, message: t('login.passwordPlaceholder'), trigger: 'blur' },
    { min: 6, message: t('login.passwordMinLength'), trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  const form = unref(formRef)
  if (!form) return
  const valid = await form.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    userStore.setToken(`${formData.username}-${Date.now()}`)
    await router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="prefixCls">
    <el-form ref="formRef" :model="formData" :rules="rules" size="large" @keyup.enter="handleLogin">
      <el-form-item prop="username">
        <el-input
          v-model="formData.username"
          :placeholder="t('login.usernamePlaceholder')"
          clearable
        >
          <template #prefix>
            <svg viewBox="0 0 24 24" :class="`${prefixCls}__icon`">
              <path
                fill="currentColor"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              ></path>
            </svg>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          show-password
          :placeholder="t('login.passwordPlaceholder')"
        >
          <template #prefix>
            <svg viewBox="0 0 24 24" :class="`${prefixCls}__icon`">
              <path
                fill="currentColor"
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"
              ></path>
            </svg>
          </template>
        </el-input>
      </el-form-item>

      <div :class="`${prefixCls}__options`">
        <el-checkbox v-model="formData.remember">{{ t('login.remember') }}</el-checkbox>
        <a :class="`${prefixCls}__link`" href="javascript:void(0)">
          {{ t('login.forgetPassword') }}
        </a>
      </div>

      <el-button
        :class="`${prefixCls}__submit`"
        type="primary"
        size="large"
        :loading="loading"
        @click="handleLogin"
      >
        {{ loading ? t('login.verifying') : t('login.login') }}
      </el-button>
    </el-form>
  </div>
</template>

<style scoped>
.v-login-form__icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  color: rgb(0 245 255 / 70%);
  vertical-align: middle;
}

.v-login-form :deep(.el-input__inner) {
  height: 48px;
  color: #fff;
  caret-color: #00f5ff;
}

.v-login-form :deep(.el-input__wrapper) {
  background-color: rgb(255 255 255 / 5%);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 10%) inset;
  transition: all 0.3s ease;
}

.v-login-form :deep(.el-input__wrapper:hover) {
  background-color: rgb(255 255 255 / 8%);
  box-shadow: 0 0 0 1px rgb(0 245 255 / 30%) inset;
}

.v-login-form :deep(.el-input__wrapper.is-focus) {
  background-color: rgb(255 255 255 / 10%);
  box-shadow:
    0 0 0 1px rgb(0 245 255 / 50%) inset,
    0 0 20px rgb(0 245 255 / 10%);
}

.v-login-form :deep(.el-input__inner::placeholder) {
  color: rgb(255 255 255 / 30%);
}

.v-login-form :deep(.el-input__suffix),
.v-login-form :deep(.el-input__prefix) {
  color: rgb(0 245 255 / 70%);
}

.v-login-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.v-login-form :deep(.el-checkbox__label) {
  font-size: 13px;
  color: rgb(255 255 255 / 50%);
}

.v-login-form :deep(.el-checkbox__inner) {
  background-color: rgb(255 255 255 / 5%);
  border-color: rgb(255 255 255 / 20%);
}

.v-login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #00f5ff;
  border-color: #00f5ff;
}

.v-login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #050a16;
}

.v-login-form__link {
  font-size: 13px;
  color: #00f5ff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.v-login-form__link:hover {
  color: #7c5cff;
  text-shadow: 0 0 10px rgb(124 92 255 / 50%);
}

.v-login-form__submit {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 4px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #00f5ff, #7c5cff);
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgb(0 245 255 / 30%);
  transition: all 0.3s ease;
}

.v-login-form__submit:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 30px rgb(0 245 255 / 40%),
    0 0 20px rgb(124 92 255 / 30%);
}

.v-login-form__submit:active {
  transform: translateY(0);
}
</style>
