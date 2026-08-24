<script setup lang="ts">
import TechBackground from './components/TechBackground.vue'
import LoginPanel from './components/LoginPanel.vue'
import LoginForm from './components/LoginForm.vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')
</script>

<template>
  <div :class="prefixCls">
    <TechBackground />
    <div :class="`${prefixCls}__main`">
      <LoginPanel>
        <LoginForm />
      </LoginPanel>
    </div>
  </div>
</template>

<style scoped>
.v-login {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #050a16;
}

.v-login__main {
  position: relative;
  z-index: 1;
}
</style>
