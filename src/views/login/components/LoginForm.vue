<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { ElButton, ElCheckbox, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import { useUserStoreWithOut } from '@/stores/modules/user'

const { t } = useI18n('login')

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
  username: [{ required: true, message: t('usernamePlaceholder'), trigger: 'blur' }],
  password: [
    { required: true, message: t('passwordPlaceholder'), trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  const form = unref(formRef)
  if (!form) return
  const valid = await form.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    userStore.setToken(`${formData.username}-${Date.now()}`)
    ElMessage.success('身份验证成功，正在进入控制台')
    await router.push('/')
  } finally {
    loading.value = false
  }
}

const oauthChannels = ['微信', '企业微信', '钉钉']

const handleOauth = (channel: string) => {
  ElMessage.info(`「${channel}」登录通道暂未开放`)
}
</script>

<template>
  <div :class="prefixCls">
    <el-form ref="formRef" :model="formData" :rules="rules" size="large" @keyup.enter="handleLogin">
      <el-form-item prop="username">
        <el-input v-model="formData.username" :placeholder="t('usernamePlaceholder')" clearable>
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
          :placeholder="t('passwordPlaceholder')"
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
        <el-checkbox v-model="formData.remember">{{ t('remember') }}</el-checkbox>
        <a :class="`${prefixCls}__link`" href="javascript:void(0)">{{ t('forgetPassword') }}</a>
      </div>

      <el-button
        :class="`${prefixCls}__submit`"
        type="primary"
        size="large"
        :loading="loading"
        @click="handleLogin"
      >
        {{ loading ? '验证中' : t('login') }}
      </el-button>
    </el-form>

    <div :class="`${prefixCls}__divider`">
      <span :class="`${prefixCls}__divider-line`"></span>
      <span :class="`${prefixCls}__divider-text`">{{ t('otherLogin') }}</span>
      <span :class="`${prefixCls}__divider-line`"></span>
    </div>

    <div :class="`${prefixCls}__oauth`">
      <button
        v-for="channel in oauthChannels"
        :key="channel"
        :class="`${prefixCls}__oauth-btn`"
        type="button"
        :title="channel"
        @click="handleOauth(channel)"
      >
        {{ channel.slice(0, 1) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.v-login-form__icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  color: rgb(53 226 255 / 75%);
  vertical-align: middle;
}

.v-login-form :deep(.el-input__inner) {
  height: 40px;
  color: #d8e9ff;
  caret-color: #35e2ff;
}

.v-login-form :deep(.el-input__wrapper) {
  background-color: rgb(13 28 51 / 65%);
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgb(53 226 255 / 22%) inset;
  transition:
    box-shadow 0.25s ease,
    background-color 0.25s ease;
}

.v-login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgb(53 226 255 / 45%) inset;
}

.v-login-form :deep(.el-input__wrapper.is-focus) {
  background-color: rgb(13 28 51 / 85%);
  box-shadow:
    0 0 0 1px #35e2ff inset,
    0 0 14px rgb(53 226 255 / 28%);
}

.v-login-form :deep(.el-input__inner::placeholder) {
  color: #5c7099;
}

.v-login-form :deep(.el-input__suffix),
.v-login-form :deep(.el-input__prefix) {
  color: rgb(53 226 255 / 75%);
}

.v-login-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.v-login-form :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #7d92b8;
}

.v-login-form :deep(.el-checkbox__inner) {
  background-color: rgb(13 28 51 / 65%);
  border-color: rgb(53 226 255 / 35%);
}

.v-login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #35e2ff;
  border-color: #35e2ff;
}

.v-login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #04101f;
}

.v-login-form__link {
  font-size: 13px;
  color: #35e2ff;
  text-decoration: none;
  transition: text-shadow 0.25s ease;
}

.v-login-form__link:hover {
  text-shadow: 0 0 10px rgb(53 226 255 / 70%);
}

.v-login-form__submit {
  width: 100%;
  letter-spacing: 4px;
  text-indent: 4px;
  background-image: linear-gradient(90deg, #00c6ff, #0072ff);
  border: none;
  border-radius: 3px;
  box-shadow: 0 0 18px rgb(0 198 255 / 40%);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.v-login-form__submit:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 26px rgb(0 198 255 / 55%),
    0 0 14px rgb(0 198 255 / 40%);
}

.v-login-form__submit:active {
  transform: translateY(0);
}

.v-login-form__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 30px 0 20px;
}

.v-login-form__divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(53 226 255 / 35%), transparent);
}

.v-login-form__divider-text {
  font-size: 12px;
  letter-spacing: 2px;
  color: #5c7099;
}

.v-login-form__oauth {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.v-login-form__oauth-btn {
  width: 42px;
  height: 42px;
  padding: 0;
  font-size: 14px;
  color: #8fa3c8;
  cursor: pointer;
  background-color: rgb(13 28 51 / 55%);
  border: 1px solid rgb(53 226 255 / 25%);
  border-radius: 50%;
  outline: none;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.v-login-form__oauth-btn:hover {
  color: #35e2ff;
  border-color: #35e2ff;
  transform: translateY(-3px);
  box-shadow: 0 0 14px rgb(53 226 255 / 35%);
}
</style>
