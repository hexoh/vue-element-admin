<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login-bg')

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  hue: number
}

interface Hexagon {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  hue: number
}

const CONNECT_DISTANCE = 150
const MOUSE_INFLUENCE = 200
const MAX_SPEED = 0.5

const canvasRef = ref<HTMLCanvasElement>()

let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let width = 0
let height = 0
let nodes: Node[] = []
let hexagons: Hexagon[] = []
const mouse = { x: -9999, y: -9999 }

const createNodes = (): Node[] => {
  const count = Math.min(80, Math.floor((width * height) / 20000))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
    baseRadius: Math.random() * 2 + 1,
    hue: Math.random() * 60 + 180
  }))
}

const createHexagons = (): Hexagon[] => {
  const count = Math.min(12, Math.floor((width * height) / 80000))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 60 + 30,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.003,
    opacity: Math.random() * 0.15 + 0.05,
    hue: Math.random() * 60 + 180
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
  nodes = createNodes()
  hexagons = createHexagons()
}

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

const handleMouseLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
}

const drawHexagon = (hex: Hexagon) => {
  if (!ctx) return
  ctx.save()
  ctx.translate(hex.x, hex.y)
  ctx.rotate(hex.rotation)

  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const x = hex.size * Math.cos(angle)
    const y = hex.size * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()

  ctx.strokeStyle = `hsla(${hex.hue}, 80%, 60%, ${hex.opacity})`
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.restore()
}

const drawNodes = () => {
  if (!ctx) return

  for (const node of nodes) {
    const dx = mouse.x - node.x
    const dy = mouse.y - node.y
    const dist = Math.hypot(dx, dy)

    if (dist < MOUSE_INFLUENCE && dist > 0.01) {
      const force = (1 - dist / MOUSE_INFLUENCE) * 0.02
      node.vx += (dx / dist) * force
      node.vy += (dy / dist) * force
    }

    const speed = Math.hypot(node.vx, node.vy)
    if (speed > MAX_SPEED) {
      node.vx = (node.vx / speed) * MAX_SPEED
      node.vy = (node.vy / speed) * MAX_SPEED
    }

    node.x += node.vx
    node.y += node.vy

    if (node.x < 0) node.x = width
    if (node.x > width) node.x = 0
    if (node.y < 0) node.y = height
    if (node.y > height) node.y = 0

    const glow = dist < MOUSE_INFLUENCE ? (1 - dist / MOUSE_INFLUENCE) * 0.5 : 0
    node.radius = node.baseRadius + glow * 3

    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${node.hue}, 80%, 70%, ${0.7 + glow * 0.3})`
    ctx.shadowColor = `hsla(${node.hue}, 80%, 60%, 0.8)`
    ctx.shadowBlur = 10 + glow * 15
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

const drawConnections = () => {
  if (!ctx) return

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]!
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]!
      const dist = Math.hypot(a.x - b.x, a.y - b.y)

      if (dist >= CONNECT_DISTANCE) continue

      const alpha = (1 - dist / CONNECT_DISTANCE) * 0.4
      const hue = (a.hue + b.hue) / 2

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    const distToMouse = Math.hypot(mouse.x - a.x, mouse.y - a.y)
    if (distToMouse < MOUSE_INFLUENCE) {
      const alpha = (1 - distToMouse / MOUSE_INFLUENCE) * 0.5
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.strokeStyle = `hsla(${a.hue}, 80%, 65%, ${alpha})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}

const drawAmbientGlow = (time: number) => {
  if (!ctx) return

  const pulse1 = Math.sin(time * 0.0005) * 0.5 + 0.5
  const pulse2 = Math.sin(time * 0.0007 + 1) * 0.5 + 0.5

  const gradient1 = ctx.createRadialGradient(
    width * 0.2,
    height * 0.3,
    0,
    width * 0.2,
    height * 0.3,
    width * 0.5
  )
  gradient1.addColorStop(0, `rgba(0, 200, 255, ${0.03 + pulse1 * 0.02})`)
  gradient1.addColorStop(1, 'rgba(0, 200, 255, 0)')
  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, width, height)

  const gradient2 = ctx.createRadialGradient(
    width * 0.8,
    height * 0.7,
    0,
    width * 0.8,
    height * 0.7,
    width * 0.4
  )
  gradient2.addColorStop(0, `rgba(140, 100, 255, ${0.025 + pulse2 * 0.015})`)
  gradient2.addColorStop(1, 'rgba(140, 100, 255, 0)')
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, width, height)
}

const render = (time: number) => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  drawAmbientGlow(time)

  for (const hex of hexagons) {
    hex.rotation += hex.rotationSpeed
    drawHexagon(hex)
  }

  drawConnections()
  drawNodes()

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
    <div :class="`${prefixCls}__overlay`"></div>
  </div>
</template>

<style scoped>
.v-login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0f1a 0%, #0d1525 50%, #0a0f1a 100%);
}

.v-login-bg__canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.v-login-bg__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 40%, rgb(8 12 21 / 60%) 100%);
}
</style>
