<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'

const { t } = useI18n('login')

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-panel')
</script>

<template>
  <div :class="prefixCls">
    <span :class="[`${prefixCls}__corner`, `${prefixCls}__corner--tl`]"></span>
    <span :class="[`${prefixCls}__corner`, `${prefixCls}__corner--tr`]"></span>
    <span :class="[`${prefixCls}__corner`, `${prefixCls}__corner--bl`]"></span>
    <span :class="[`${prefixCls}__corner`, `${prefixCls}__corner--br`]"></span>

    <div :class="`${prefixCls}__scanline`"></div>

    <header :class="`${prefixCls}__header`">
      <span :class="`${prefixCls}__badge`">SECURE ACCESS</span>
      <h2 :class="`${prefixCls}__title`">{{ t('welcome') }}</h2>
      <p :class="`${prefixCls}__subtitle`">{{ t('message') }}</p>
    </header>

    <slot></slot>
  </div>
</template>

<style scoped>
.v-login-panel {
  position: relative;
  width: 420px;
  max-width: calc(100vw - 32px);
  padding: 42px 38px;
  background: linear-gradient(160deg, rgb(13 26 48 / 72%), rgb(6 12 26 / 85%));
  border: 1px solid rgb(53 226 255 / 22%);
  border-radius: 4px;
  box-shadow:
    0 0 42px rgb(0 140 255 / 12%),
    inset 0 0 22px rgb(53 226 255 / 5%);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  backdrop-filter: blur(14px);
}

.v-login-panel:hover {
  border-color: rgb(53 226 255 / 45%);
  box-shadow:
    0 0 60px rgb(0 170 255 / 20%),
    inset 0 0 26px rgb(53 226 255 / 8%);
}

.v-login-panel__corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px solid #35e2ff;
  animation: v-panel-corner-pulse 2.4s ease-in-out infinite;
}

.v-login-panel__corner--tl {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.v-login-panel__corner--tr {
  top: -1px;
  right: -1px;
  border-bottom: none;
  border-left: none;
  animation-delay: 0.3s;
}

.v-login-panel__corner--bl {
  bottom: -1px;
  left: -1px;
  border-top: none;
  border-right: none;
  animation-delay: 0.6s;
}

.v-login-panel__corner--br {
  right: -1px;
  bottom: -1px;
  border-top: none;
  border-left: none;
  animation-delay: 0.9s;
}

.v-login-panel__scanline {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: inherit;
}

.v-login-panel__scanline::after {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 30%;
  background: linear-gradient(to bottom, transparent, rgb(53 226 255 / 7%), transparent);
  content: '';
  animation: v-panel-scan 5s linear infinite;
}

.v-login-panel__header {
  margin-bottom: 28px;
  text-align: center;
}

.v-login-panel__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  margin-bottom: 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 4px;
  color: #35e2ff;
  border: 1px solid rgb(53 226 255 / 35%);
  border-radius: 999px;
}

.v-login-panel__badge::before {
  width: 6px;
  height: 6px;
  background-color: #35e2ff;
  border-radius: 50%;
  content: '';
  box-shadow: 0 0 8px rgb(53 226 255 / 90%);
  animation: v-panel-blink 1.6s ease-in-out infinite;
}

.v-login-panel__title {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #e6f1ff;
  text-shadow: 0 0 18px rgb(53 226 255 / 30%);
}

.v-login-panel__subtitle {
  margin: 0;
  font-size: 13px;
  letter-spacing: 1px;
  color: #7d92b8;
}

@keyframes v-panel-scan {
  from {
    transform: translateY(-110%);
  }

  to {
    transform: translateY(380%);
  }
}

@keyframes v-panel-corner-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 6px rgb(53 226 255 / 55%);
  }

  50% {
    opacity: 0.35;
    box-shadow: none;
  }
}

@keyframes v-panel-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}
</style>
