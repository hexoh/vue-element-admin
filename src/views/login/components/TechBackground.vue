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
  color: string
}

const LINK_DISTANCE = 120
const MOUSE_DISTANCE = 150
const MAX_SPEED = 0.8

const canvasRef = ref<HTMLCanvasElement>()

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let width = 0
let height = 0
let particles: Particle[] = []
const mouse = { x: -9999, y: -9999 }

const colors = ['rgba(0, 245, 255, 0.7)', 'rgba(124, 92, 255, 0.7)', 'rgba(255, 255, 255, 0.5)']

const createParticles = (): Particle[] => {
  const count = Math.min(100, Math.floor((width * height) / 18000))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)] as string
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
      p.vx += (dx / distance) * 0.01
      p.vy += (dy / distance) * 0.01
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
    ctx.fillStyle = p.color
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
      ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / LINK_DISTANCE)})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    const mDistance = Math.hypot(mouse.x - current.x, mouse.y - current.y)
    if (mDistance < MOUSE_DISTANCE) {
      ctx.beginPath()
      ctx.moveTo(current.x, current.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.strokeStyle = `rgba(0, 245, 255, ${0.3 * (1 - mDistance / MOUSE_DISTANCE)})`
      ctx.lineWidth = 0.6
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
    <div :class="`${prefixCls}__gradient`"></div>
    <div :class="[`${prefixCls}__orb`, `${prefixCls}__orb--1`]"></div>
    <div :class="[`${prefixCls}__orb`, `${prefixCls}__orb--2`]"></div>
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

.v-login-bg__gradient {
  position: absolute;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 0%, rgb(5 10 22 / 80%) 100%);
  inset: 0;
}

.v-login-bg__orb {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(80px);
}

.v-login-bg__orb--1 {
  top: -20%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgb(0 245 255 / 15%), transparent 70%);
  animation: orbFloat 12s ease-in-out infinite alternate;
}

.v-login-bg__orb--2 {
  right: -15%;
  bottom: -25%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgb(124 92 255 / 12%), transparent 70%);
  animation: orbFloat 16s ease-in-out infinite alternate-reverse;
}

@keyframes orbFloat {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(50px, 40px) scale(1.1);
  }
}
</style>
