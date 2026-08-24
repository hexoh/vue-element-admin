<script setup lang="ts">
import TechBackground from './components/TechBackground.vue'
import BrandPanel from './components/BrandPanel.vue'
import LoginPanel from './components/LoginPanel.vue'
import LoginForm from './components/LoginForm.vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')
</script>

<template>
  <div :class="prefixCls">
    <TechBackground />
    <div :class="[`${prefixCls}__main`, 'center']">
      <BrandPanel />
      <LoginPanel>
        <LoginForm />
      </LoginPanel>
    </div>
  </div>
</template>

<style scoped>
.v-login {
  min-height: 100vh;
  background-color: #050a16;
}

.v-login__main {
  position: relative;
  z-index: 1;
  gap: 110px;
  min-height: 100vh;
  padding: 24px;
}

@media screen and (width <= 992px) {
  .v-login__main {
    gap: 0;
  }

  .v-login-brand {
    display: none;
  }
}
</style>
