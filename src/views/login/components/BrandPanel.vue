<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-brand')

interface Feature {
  index: string
  label: string
}

const features: Feature[] = [
  { index: '01', label: '实时链路监控' },
  { index: '02', label: '分布式算力调度' },
  { index: '03', label: '量子级加密传输' },
  { index: '04', label: 'AI 智能风控引擎' }
]

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '99.99%', label: '服务可用性' },
  { value: '128ms', label: '平均响应' },
  { value: '2048', label: '在线节点' }
]
</script>

<template>
  <div :class="prefixCls">
    <div :class="[`${prefixCls}__logo`, 'center']">
      <span :class="`${prefixCls}__ring ${prefixCls}__ring--outer`"></span>
      <span :class="`${prefixCls}__ring ${prefixCls}__ring--inner`"></span>
      <span :class="`${prefixCls}__ring ${prefixCls}__ring--arc`"></span>
      <svg viewBox="0 0 100 100" :class="`${prefixCls}__hex`" fill="none">
        <defs>
          <linearGradient id="login-hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#35e2ff"></stop>
            <stop offset="100%" stop-color="#7c5cff"></stop>
          </linearGradient>
        </defs>
        <polygon
          points="50,6 90,28 90,72 50,94 10,72 10,28"
          stroke="url(#login-hex-gradient)"
          stroke-width="2.5"
          fill="rgba(53, 226, 255, 0.06)"
        ></polygon>
        <polyline
          points="50,26 72,39 72,61 50,74 28,61 28,39"
          stroke="rgba(53, 226, 255, 0.45)"
          stroke-width="1.4"
        ></polyline>
        <circle cx="50" cy="50" r="8" fill="#35e2ff"></circle>
        <circle cx="50" cy="26" r="3" fill="#35e2ff"></circle>
        <circle cx="72" cy="61" r="3" fill="#7c5cff"></circle>
      </svg>
    </div>

    <h1 :class="`${prefixCls}__title`" data-text="NEXUS · 云端智控中枢">NEXUS · 云端智控中枢</h1>
    <p :class="`${prefixCls}__subtitle`">NEXT-GENERATION INTELLIGENT CONTROL PLATFORM</p>

    <ul :class="`${prefixCls}__features`">
      <li v-for="item in features" :key="item.index" :class="`${prefixCls}__feature`">
        <span :class="`${prefixCls}__feature-index`">{{ item.index }}</span>
        <span :class="`${prefixCls}__feature-label`">{{ item.label }}</span>
      </li>
    </ul>

    <div :class="`${prefixCls}__stats`">
      <div v-for="item in stats" :key="item.label" :class="`${prefixCls}__stat`">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-login-brand {
  position: relative;
  max-width: 520px;
  color: #d9e8ff;
}

.v-login-brand__logo {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 36px;
}

.v-login-brand__hex {
  width: 84px;
  height: 84px;
  filter: drop-shadow(0 0 12px rgb(53 226 255 / 55%));
}

.v-login-brand__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.v-login-brand__ring--outer {
  width: 140px;
  height: 140px;
  border: 1px dashed rgb(53 226 255 / 35%);
  animation: v-brand-rotate 24s linear infinite;
}

.v-login-brand__ring--inner {
  width: 112px;
  height: 112px;
  border: 1px dotted rgb(124 92 255 / 45%);
  animation: v-brand-rotate-reverse 32s linear infinite;
}

.v-login-brand__ring--arc {
  width: 126px;
  height: 126px;
  border: 1px solid transparent;
  border-top-color: rgb(53 226 255 / 90%);
  animation: v-brand-rotate 5s linear infinite;
}

.v-login-brand__title {
  position: relative;
  margin: 0 0 14px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 0 24px rgb(53 226 255 / 35%);
}

.v-login-brand__title::before,
.v-login-brand__title::after {
  position: absolute;
  top: 0;
  left: 0;
  content: attr(data-text);
  opacity: 0.85;
}

.v-login-brand__title::before {
  color: #35e2ff;
  animation: v-brand-glitch-a 3.4s infinite steps(1);
}

.v-login-brand__title::after {
  color: #b13cff;
  animation: v-brand-glitch-b 2.9s infinite steps(1);
}

.v-login-brand__subtitle {
  margin: 0 0 44px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  letter-spacing: 5px;
  color: #7d92b8;
}

.v-login-brand__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 32px;
  padding: 0;
  margin: 0 0 48px;
  list-style: none;
}

.v-login-brand__feature {
  display: flex;
  padding: 10px 14px;
  cursor: default;
  background: linear-gradient(90deg, rgb(13 30 56 / 55%), rgb(13 30 56 / 0%));
  border: 1px solid rgb(53 226 255 / 14%);
  border-left: 2px solid rgb(53 226 255 / 55%);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  align-items: center;
  gap: 12px;
}

.v-login-brand__feature:hover {
  border-color: rgb(53 226 255 / 50%);
  transform: translateX(6px);
  box-shadow: 0 0 16px rgb(53 226 255 / 18%);
}

.v-login-brand__feature-index {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: #35e2ff;
}

.v-login-brand__feature-label {
  font-size: 14px;
  letter-spacing: 1px;
}

.v-login-brand__stats {
  display: flex;
  gap: 40px;
}

.v-login-brand__stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.v-login-brand__stat strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 22px;
  color: #35e2ff;
  text-shadow: 0 0 12px rgb(53 226 255 / 40%);
}

.v-login-brand__stat span {
  font-size: 12px;
  letter-spacing: 1px;
  color: #7d92b8;
}

@keyframes v-brand-rotate {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes v-brand-rotate-reverse {
  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes v-brand-glitch-a {
  0%,
  91%,
  100% {
    clip-path: inset(50% 0 50% 0);
    transform: none;
  }

  92% {
    clip-path: inset(12% 0 64% 0);
    transform: translate(-3px, -2px);
  }

  94% {
    clip-path: inset(58% 0 10% 0);
    transform: translate(3px, 1px);
  }

  96% {
    clip-path: inset(30% 0 42% 0);
    transform: translate(-2px, 2px);
  }
}

@keyframes v-brand-glitch-b {
  0%,
  88%,
  100% {
    clip-path: inset(50% 0 50% 0);
    transform: none;
  }

  89% {
    clip-path: inset(66% 0 6% 0);
    transform: translate(3px, 2px);
  }

  93% {
    clip-path: inset(8% 0 70% 0);
    transform: translate(-3px, -1px);
  }

  97% {
    clip-path: inset(40% 0 34% 0);
    transform: translate(2px, -2px);
  }
}
</style>
