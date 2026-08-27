<script setup lang="ts">
import { ElButton, ElCheckbox, ElForm, ElFormItem, ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { useValidator } from '@/hooks/web/useValidator'
import { loginApi } from '@/api/login'

const { t } = useI18n()

const { required, lengthRange } = useValidator()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-form')

const router = useRouter()

const userStore = useUserStoreWithOut()

interface LoginFormData {
  username: string
  password: string
  remember: boolean
}

const formRef = useTemplateRef<FormInstance>('formRef')

const loading = ref(false)

const rules = reactive<FormRules>({
  username: [required()],
  password: [required(), lengthRange({ min: 1, max: 20 })]
})

const formData = reactive<LoginFormData>({
  username: 'admin',
  password: 'admin',
  remember: true
})

const handleLogin = async () => {
  const form = unref(formRef)
  if (!form) return
  const valid = await form.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await loginApi(formData)
    console.log('login res', res)
    userStore.setToken(`${formData.username}-${Date.now()}`)
    await router.push('/')
  } catch (error) {
    console.error('login error', error)
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
            <icon-ep-user />
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
            <icon-ep-lock />
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
