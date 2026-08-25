<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'

const { t } = useI18n()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-panel')
</script>

<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__border`"></div>
    <div :class="`${prefixCls}__glow`"></div>

    <header :class="`${prefixCls}__header`">
      <div :class="`${prefixCls}__logo`">
        <icon-local-login-logo />
      </div>
      <h2 :class="`${prefixCls}__title`">{{ t('login.welcome') }}</h2>
      <p :class="`${prefixCls}__subtitle`">{{ t('login.message') }}</p>
    </header>

    <slot></slot>

    <footer :class="`${prefixCls}__footer`">
      <span :class="`${prefixCls}__dot`"></span>
      <span>{{ t('login.secureConnection') }}</span>
    </footer>
  </div>
</template>

<style scoped>
.v-login-panel {
  position: relative;
  width: 440px;
  max-width: calc(100vw - 32px);
  padding: 48px 40px;
  background: linear-gradient(135deg, rgb(10 20 40 / 90%), rgb(5 10 25 / 95%));
  border-radius: 16px;
  backdrop-filter: blur(20px);
}

.v-login-panel__border {
  position: absolute;
  padding: 1px;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgb(0 245 255 / 50%),
    rgb(124 92 255 / 50%),
    rgb(0 245 255 / 10%)
  );
  border-radius: 16px;
  animation: borderRotate 4s linear infinite;
  inset: 0;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.v-login-panel__glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  background: radial-gradient(circle at 30% 30%, rgb(0 245 255 / 10%), transparent 50%);
  animation: glowMove 8s ease-in-out infinite alternate;
}

.v-login-panel__header {
  position: relative;
  margin-bottom: 36px;
  text-align: center;
}

.v-login-panel__logo {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  animation: logoPulse 3s ease-in-out infinite;
}

.v-login-panel__logo :deep(svg) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 15px rgb(0 245 255 / 50%));
}

.v-login-panel__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 0 20px rgb(0 245 255 / 30%);
}

.v-login-panel__subtitle {
  margin: 0;
  font-size: 14px;
  letter-spacing: 1px;
  color: rgb(255 255 255 / 50%);
}

.v-login-panel__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  font-size: 11px;
  letter-spacing: 1px;
  color: rgb(255 255 255 / 30%);
}

.v-login-panel__dot {
  width: 6px;
  height: 6px;
  background-color: #00f5ff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgb(0 245 255 / 80%);
  animation: dotBlink 2s ease-in-out infinite;
}

@keyframes borderRotate {
  to {
    filter: hue-rotate(360deg);
  }
}

@keyframes glowMove {
  from {
    transform: translate(-10%, -10%);
  }

  to {
    transform: translate(10%, 10%);
  }
}

@keyframes logoPulse {
  0%,
  100% {
    filter: drop-shadow(0 0 15px rgb(0 245 255 / 50%));
    transform: scale(1);
  }

  50% {
    filter: drop-shadow(0 0 25px rgb(0 245 255 / 70%));
    transform: scale(1.05);
  }
}

@keyframes dotBlink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>
