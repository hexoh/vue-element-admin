<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-bg')

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const LINK_DISTANCE = 140
const MOUSE_DISTANCE = 170
const MAX_SPEED = 0.9

const canvasRef = ref<HTMLCanvasElement>()

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let width = 0
let height = 0
let particles: Particle[] = []
const mouse = { x: -9999, y: -9999 }

const createParticles = (): Particle[] => {
  const count = Math.min(120, Math.floor((width * height) / 15000))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 1.5 + 0.6
  }))
}

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas || !canvas.parentElement) return
  const dpr = window.devicePixelRatio || 1
  width = canvas.parentElement.clientWidth
  height = canvas.parentElement.clientHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  particles = createParticles()
}

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

const handleMouseLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
}

const render = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const distance = Math.hypot(dx, dy)
    if (distance < MOUSE_DISTANCE && distance > 0.01) {
      p.vx += (dx / distance) * 0.015
      p.vy += (dy / distance) * 0.015
    }
    const speed = Math.hypot(p.vx, p.vy)
    if (speed > MAX_SPEED) {
      p.vx = (p.vx / speed) * MAX_SPEED
      p.vy = (p.vy / speed) * MAX_SPEED
    }
    p.x += p.vx
    p.y += p.vy
    if (p.x <= 0 || p.x >= width) p.vx *= -1
    if (p.y <= 0 || p.y >= height) p.vy *= -1

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(64, 216, 255, 0.75)'
    ctx.fill()
  }

  for (let i = 0; i < particles.length; i++) {
    const current = particles[i]
    if (!current) continue

    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j]
      if (!other) continue
      const distance = Math.hypot(current.x - other.x, current.y - other.y)
      if (distance >= LINK_DISTANCE) continue
      ctx.beginPath()
      ctx.moveTo(current.x, current.y)
      ctx.lineTo(other.x, other.y)
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 * (1 - distance / LINK_DISTANCE)})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    const mDistance = Math.hypot(mouse.x - current.x, mouse.y - current.y)
    if (mDistance < MOUSE_DISTANCE) {
      ctx.beginPath()
      ctx.moveTo(current.x, current.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.strokeStyle = `rgba(53, 226, 255, ${0.45 * (1 - mDistance / MOUSE_DISTANCE)})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }
  }

  animationId = requestAnimationFrame(render)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', handleMouseLeave)
  animationId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseout', handleMouseLeave)
})
</script>

<template>
  <div :class="prefixCls">
    <canvas ref="canvasRef" :class="`${prefixCls}__canvas`"></canvas>
    <div :class="`${prefixCls}__grid`"></div>
    <div :class="[`${prefixCls}__glow`, `${prefixCls}__glow--cyan`]"></div>
    <div :class="[`${prefixCls}__glow`, `${prefixCls}__glow--purple`]"></div>
  </div>
</template>

<style scoped>
.v-login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background-color: #050a16;
}

.v-login-bg__canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.v-login-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(53 226 255 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(53 226 255 / 5%) 1px, transparent 1px);
  background-size: 42px 42px;
  animation: v-bg-grid-move 6s linear infinite;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 78%);
}

.v-login-bg__glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
}

.v-login-bg__glow--cyan {
  top: -160px;
  left: -140px;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, rgb(0 198 255 / 18%), transparent 65%);
  animation: v-bg-float 14s ease-in-out infinite alternate;
}

.v-login-bg__glow--purple {
  right: -180px;
  bottom: -200px;
  width: 640px;
  height: 640px;
  background: radial-gradient(circle, rgb(139 92 246 / 16%), transparent 65%);
  animation: v-bg-float 18s ease-in-out infinite alternate-reverse;
}

@keyframes v-bg-grid-move {
  to {
    background-position:
      42px 42px,
      42px 42px;
  }
}

@keyframes v-bg-float {
  to {
    transform: translate(40px, 30px);
  }
}
</style>
