import {
  prepareWithSegments,
  layoutNextLine,
  type PreparedTextWithSegments,
  type LayoutCursor,
} from '../../pretext/src/layout.ts'

const TEXT = `This space is designed to help you move from scattered thoughts to clear direction. Whether you're exploring an idea, organizing your workflow, or refining details, everything stays flexible and easy to adjust. You can start simple, iterate quickly, and build structure over time without losing momentum. It's not about perfection—it's about making progress visible. Most ideas don't start fully formed. They begin as fragments—notes, sketches, questions. This space gives those fragments room to grow. As you work, patterns start to emerge, decisions become clearer, and what once felt messy turns into something intentional. The goal isn't to force structure too early, but to let it happen naturally through iteration. Everything here is built to support clarity and flow. Information is organized in a way that helps you quickly understand what's happening, what needs attention, and what comes next. You can move between different states—exploring, editing, finalizing—without friction. The system adapts as your needs change, so you're never locked into a single way of working. Sometimes the hardest part is simply starting. Once you begin, things shift. Ideas connect, directions form, and small steps add up. This space is meant to support that process quietly in the background—giving you just enough structure to stay grounded, while leaving room for exploration and change. Design is rarely a straight line. It moves between uncertainty and clarity, exploration and decision. This environment is built to support that rhythm—helping you navigate complexity, test ideas quickly, and shape outcomes with intention. Over time, what starts as ambiguity becomes something structured, thoughtful, and real.`

const FONT = '16px "Source Code Pro", monospace'
const LINE_HEIGHT = 24
const PADDING = 16
const STROKE_RADIUS = 6
const TEXT_COLOR = 'rgba(255, 255, 255, 0.82)'
const BAR_HEIGHT = 56

type StrokeStyle = 'double' | 'neon' | 'dashed' | 'bunny'
type StrokeRecord = { points: Array<{ x: number; y: number }>; style: StrokeStyle }
type ImageShape = 'original' | 'circle' | 'heart' | 'square'
const SHAPES: ImageShape[] = ['original', 'circle', 'heart', 'square']
type PlacedImage = {
  img: HTMLImageElement
  x: number; y: number; w: number; h: number
  shape: ImageShape
  dragging: boolean
  dragOffsetX: number; dragOffsetY: number
}

// --- State ---
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
let W = 0
let H = 0
let prepared: PreparedTextWithSegments | null = null
const strokes: StrokeRecord[] = []
let currentStroke: StrokeRecord | null = null
let penStyle: StrokeStyle = 'double'
const placedImages: PlacedImage[] = []

// --- Interval math ---
type Interval = { left: number; right: number }

function getAllPoints(): Array<{ x: number; y: number }>[] {
  const all: Array<{ x: number; y: number }>[] = []
  for (let i = 0; i < strokes.length; i++) all.push(strokes[i]!.points)
  if (currentStroke !== null) all.push(currentStroke.points)
  return all
}

function getStrokeIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  const intervals: Interval[] = []
  const r = STROKE_RADIUS
  const pointSets = getAllPoints()

  for (let si = 0; si < pointSets.length; si++) {
    const pts = pointSets[si]!
    for (let pi = 0; pi < pts.length; pi++) {
      const p = pts[pi]!
      if (bandBottom < p.y - r || bandTop > p.y + r) continue
      const dyTop = Math.abs(bandTop - p.y)
      const dyBot = Math.abs(bandBottom - p.y)
      const dyMid = Math.abs((bandTop + bandBottom) / 2 - p.y)
      let maxDx = 0
      if (r * r - dyTop * dyTop > 0) { const dx = Math.sqrt(r * r - dyTop * dyTop); if (dx > maxDx) maxDx = dx }
      if (r * r - dyBot * dyBot > 0) { const dx = Math.sqrt(r * r - dyBot * dyBot); if (dx > maxDx) maxDx = dx }
      if (r * r - dyMid * dyMid > 0) { const dx = Math.sqrt(r * r - dyMid * dyMid); if (dx > maxDx) maxDx = dx }
      if (maxDx > 0) intervals.push({ left: p.x - maxDx, right: p.x + maxDx })
    }
  }

  if (intervals.length <= 1) return intervals
  intervals.sort((a, b) => a.left - b.left)
  const merged: Interval[] = [intervals[0]!]
  for (let i = 1; i < intervals.length; i++) {
    const curr = intervals[i]!
    const last = merged[merged.length - 1]!
    if (curr.left <= last.right) {
      if (curr.right > last.right) last.right = curr.right
    } else {
      merged.push(curr)
    }
  }
  return merged
}

function getImageIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  const intervals: Interval[] = []
  const pad = 4
  for (let i = 0; i < placedImages.length; i++) {
    const img = placedImages[i]!
    const cx = img.x + img.w / 2
    const cy = img.y + img.h / 2
    const r = Math.min(img.w, img.h) / 2

    if (img.shape === 'original') {
      // Rectangle
      if (bandBottom <= img.y - pad || bandTop >= img.y + img.h + pad) continue
      intervals.push({ left: img.x - pad, right: img.x + img.w + pad })
    } else if (img.shape === 'square') {
      // Square centered
      const side = Math.min(img.w, img.h)
      const sx = cx - side / 2
      const sy = cy - side / 2
      if (bandBottom <= sy - pad || bandTop >= sy + side + pad) continue
      intervals.push({ left: sx - pad, right: sx + side + pad })
    } else if (img.shape === 'circle') {
      // Circle
      if (bandBottom < cy - r - pad || bandTop > cy + r + pad) continue
      const bandMid = (bandTop + bandBottom) / 2
      const dy = bandMid - cy
      const dxSq = (r + pad) * (r + pad) - dy * dy
      if (dxSq <= 0) continue
      const dx = Math.sqrt(dxSq)
      intervals.push({ left: cx - dx, right: cx + dx })
    } else if (img.shape === 'heart') {
      // Approximate heart as a shape wider at top, pointed at bottom
      if (bandBottom < cy - r - pad || bandTop > cy + r + pad) continue
      const bandMid = (bandTop + bandBottom) / 2
      const t = (bandMid - (cy - r)) / (2 * r) // 0 at top, 1 at bottom
      let halfW: number
      if (t < 0.35) {
        // Top lobes: wide
        halfW = r * (0.7 + 0.3 * Math.sin(t / 0.35 * Math.PI))
      } else {
        // Taper to point
        halfW = r * (1.0 - (t - 0.35) / 0.65) * 1.0
      }
      halfW = Math.max(halfW, 0) + pad
      intervals.push({ left: cx - halfW, right: cx + halfW })
    }
  }
  return intervals
}

function carveSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots: Interval[] = [base]
  for (let bi = 0; bi < blocked.length; bi++) {
    const b = blocked[bi]!
    const next: Interval[] = []
    for (let si = 0; si < slots.length; si++) {
      const slot = slots[si]!
      if (b.right <= slot.left || b.left >= slot.right) { next.push(slot); continue }
      if (b.left > slot.left) next.push({ left: slot.left, right: b.left })
      if (b.right < slot.right) next.push({ left: b.right, right: slot.right })
    }
    slots = next
  }
  return slots.filter(function (s) { return s.right - s.left >= 20 })
}

// --- Bunny image ---
let bunnyImg: HTMLImageElement | null = null
const bunnyReady = new Promise<void>(function (resolve) {
  const img = new Image()
  img.onload = function () { bunnyImg = img; resolve() }
  img.onerror = function () { resolve() }
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzExMzhfMTIzMzQ5KSI+CjxwYXRoIGQ9Ik0yOC45NSAxOS44MUgyNy40M1YyNy40M0gyOC45NVYxOS44MVoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTI3LjQzIDI3LjQzSDI1LjkxVjI4Ljk2SDI3LjQzVjI3LjQzWiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMjcuNDMgMTYuNzZIMjUuOTFWMTkuODFIMjcuNDNWMTYuNzZaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yNS45MSAzLjA1SDI0LjM4VjE2Ljc2SDI1LjkxVjMuMDVaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yNS45MSAyOC45NkgyMi44NlYzMC40OEgyNS45MVYyOC45NloiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTI0LjM4IDEuNTNIMjIuODZWMy4wNUgyNC4zOFYxLjUzWiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMjIuODYgMEgxOS44MVYxLjUzSDIyLjg2VjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMi44NiAzMC40OEg5LjE0OTk2VjMySDIyLjg2VjMwLjQ4WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMjEuMzQgMTguMjlIMTkuODFWMTkuODFIMjEuMzRWMTguMjlaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMi44NiA0LjU3SDE5LjgxVjEzLjcySDIyLjg2VjQuNTdaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0xOS44MSAyMi44NkgxOC4yOVYyNC4zOEgxOS44MVYyMi44NloiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTE5LjgxIDEuNTNIMTguMjlWMy4wNUgxOS44MVYxLjUzWiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMTguMjkgMy4wNUgxNi43NlYxNS4yNEgxOC4yOVYzLjA1WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMTguMjkgMjQuMzhIMTUuMjRWMjUuOTFIMTguMjlWMjQuMzhaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0xNS4yNCAyMi44NkgxNi43NlYyMS4zNEgxOC4yOVYxOS44MUgxMy43MlYyMS4zNEgxNS4yNFYyMi44NloiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTE2Ljc2IDE1LjI0SDE1LjI0VjE2Ljc2SDE2Ljc2VjE1LjI0WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMTUuMjQgMy4wNUgxMy43MlYxNS4yNEgxNS4yNFYzLjA1WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNMTMuNzIgMS41M0gxMi4xOVYzLjA1SDEzLjcyVjEuNTNaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0xMi4xOSAxOC4yOUgxMC42N1YxOS44MUgxMi4xOVYxOC4yOVoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTEyLjE5IDBIOS4xNDk5NlYxLjUzSDEyLjE5VjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0xMi4xOSA0LjU3SDkuMTQ5OTZWMTMuNzJIMTIuMTlWNC41N1oiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTkuMTQ5OTggMjguOTZINi4wOTk5OFYzMC40OEg5LjE0OTk4VjI4Ljk2WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNOS4xNDk5OSAxLjUzSDcuNjJWMy4wNUg5LjE0OTk5VjEuNTNaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik03LjYxOTk4IDMuMDVINi4wOTk5OFYxNi43Nkg3LjYxOTk4VjMuMDVaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik02LjEwMDAxIDI3LjQzSDQuNTcwMDFWMjguOTZINi4xMDAwMVYyNy40M1oiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTYuMTAwMDEgMTYuNzZINC41NzAwMVYxOS44MUg2LjEwMDAxVjE2Ljc2WiIgZmlsbD0iI2ZmZmZmZiIvPgo8cGF0aCBkPSJNNC41Njk5OSAxOS44MUgzLjA0OTk5VjI3LjQzSDQuNTY5OTlWMTkuODFaIiBmaWxsPSIjZmZmZmZmIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTEzOF8xMjMzNDkiPgo8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=='
})

// --- Stroke rendering ---

function tracePath(pts: Array<{ x: number; y: number }>) {
  ctx.beginPath()
  ctx.moveTo(pts[0]!.x, pts[0]!.y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y)
}

function drawStrokePath(pts: Array<{ x: number; y: number }>, style: StrokeStyle) {
  if (pts.length < 2) return

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 1
  ctx.setLineDash([])

  if (style === 'double') {
    // Two parallel lines offset from each other
    const offset = 4 // half the gap between the two lines
    for (let pass = 0; pass < 2; pass++) {
      const sign = pass === 0 ? -1 : 1
      ctx.beginPath()
      for (let i = 0; i < pts.length; i++) {
        // Compute normal direction to offset the line
        let nx = 0, ny = 0
        if (i < pts.length - 1) {
          const dx = pts[i + 1]!.x - pts[i]!.x
          const dy = pts[i + 1]!.y - pts[i]!.y
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          nx = -dy / len
          ny = dx / len
        } else if (i > 0) {
          const dx = pts[i]!.x - pts[i - 1]!.x
          const dy = pts[i]!.y - pts[i - 1]!.y
          const len = Math.sqrt(dx * dx + dy * dy) || 1
          nx = -dy / len
          ny = dx / len
        }
        const x = pts[i]!.x + nx * offset * sign
        const y = pts[i]!.y + ny * offset * sign
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = pass === 0 ? '#ffffff' : '#E14619'
      ctx.lineWidth = 3
      ctx.stroke()
    }
  }

  else if (style === 'neon') {
    // Wide soft pink glow
    tracePath(pts)
    ctx.strokeStyle = '#ff69b4'
    ctx.lineWidth = STROKE_RADIUS * 2 + 16
    ctx.globalAlpha = 0.12
    ctx.stroke()
    // Medium glow
    tracePath(pts)
    ctx.strokeStyle = '#ff69b4'
    ctx.lineWidth = STROKE_RADIUS * 2 + 8
    ctx.globalAlpha = 0.25
    ctx.stroke()
    // Inner glow
    tracePath(pts)
    ctx.strokeStyle = '#ff8ec7'
    ctx.lineWidth = STROKE_RADIUS * 2
    ctx.globalAlpha = 0.5
    ctx.stroke()
    // Core bright pink
    tracePath(pts)
    ctx.strokeStyle = '#ffb6dd'
    ctx.lineWidth = 3
    ctx.globalAlpha = 1
    ctx.stroke()
  }

  else if (style === 'dashed') {
    // Dots along the path
    ctx.fillStyle = '#6C71FF'
    // Walk along the path placing dots
    let dist = 0
    const spacing = 12
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i]!.x - pts[i - 1]!.x
      const dy = pts[i]!.y - pts[i - 1]!.y
      const segLen = Math.sqrt(dx * dx + dy * dy)
      let traveled = 0
      while (traveled < segLen) {
        const t = traveled / segLen
        const x = pts[i - 1]!.x + dx * t
        const y = pts[i - 1]!.y + dy * t
        if (dist % spacing < 1) {
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
        traveled += 1
        dist += 1
      }
    }
  }

  else if (style === 'bunny') {
    if (bunnyImg === null) return
    // Stamp bunnies along the path
    const spacing = 28
    let dist = 0
    const size = 24
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i]!.x - pts[i - 1]!.x
      const dy = pts[i]!.y - pts[i - 1]!.y
      const segLen = Math.sqrt(dx * dx + dy * dy)
      let traveled = 0
      while (traveled < segLen) {
        const t = traveled / segLen
        const x = pts[i - 1]!.x + dx * t
        const y = pts[i - 1]!.y + dy * t
        if (dist % spacing < 1) {
          ctx.drawImage(bunnyImg, x - size / 2, y - size / 2, size, size)
        }
        traveled += 1
        dist += 1
      }
    }
  }
}

// --- Image rendering with shape clipping ---
function drawPlacedImage(pi: PlacedImage) {
  const cx = pi.x + pi.w / 2
  const cy = pi.y + pi.h / 2
  const r = Math.min(pi.w, pi.h) / 2

  ctx.save()

  if (pi.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
  } else if (pi.shape === 'square') {
    const side = Math.min(pi.w, pi.h)
    ctx.beginPath()
    ctx.rect(cx - side / 2, cy - side / 2, side, side)
    ctx.clip()
  } else if (pi.shape === 'heart') {
    ctx.beginPath()
    const topY = cy - r * 0.6
    // Heart path using bezier curves
    ctx.moveTo(cx, cy + r) // bottom point
    ctx.bezierCurveTo(cx - r * 1.5, cy - r * 0.2, cx - r * 0.8, cy - r * 1.2, cx, cy - r * 0.4)
    ctx.bezierCurveTo(cx + r * 0.8, cy - r * 1.2, cx + r * 1.5, cy - r * 0.2, cx, cy + r)
    ctx.clip()
  }
  // 'original' = no clip, just draw rect

  ctx.drawImage(pi.img, pi.x, pi.y, pi.w, pi.h)
  ctx.restore()

  // Draw shape outline
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  if (pi.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  } else if (pi.shape === 'square') {
    const side = Math.min(pi.w, pi.h)
    ctx.strokeRect(cx - side / 2, cy - side / 2, side, side)
  } else if (pi.shape === 'heart') {
    ctx.beginPath()
    ctx.moveTo(cx, cy + r)
    ctx.bezierCurveTo(cx - r * 1.5, cy - r * 0.2, cx - r * 0.8, cy - r * 1.2, cx, cy - r * 0.4)
    ctx.bezierCurveTo(cx + r * 0.8, cy - r * 1.2, cx + r * 1.5, cy - r * 0.2, cx, cy + r)
    ctx.stroke()
  } else {
    ctx.strokeRect(pi.x, pi.y, pi.w, pi.h)
  }
}

// --- Render ---
function render() {
  ctx.clearRect(0, 0, W, H)

  // Draw placed images
  for (let i = 0; i < placedImages.length; i++) {
    drawPlacedImage(placedImages[i]!)
  }

  // Draw strokes
  for (let si = 0; si < strokes.length; si++) {
    drawStrokePath(strokes[si]!.points, strokes[si]!.style)
  }
  if (currentStroke !== null) {
    drawStrokePath(currentStroke.points, currentStroke.style)
  }

  // Layout text
  if (prepared === null) return

  ctx.font = FONT
  ctx.fillStyle = TEXT_COLOR
  ctx.textBaseline = 'top'
  ctx.globalAlpha = 1

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = PADDING
  const maxY = H - PADDING

  while (y + LINE_HEIGHT <= maxY) {
    const bandTop = y
    const bandBottom = y + LINE_HEIGHT
    const strokeBlocked = getStrokeIntervalsForBand(bandTop, bandBottom)
    const imageBlocked = getImageIntervalsForBand(bandTop, bandBottom)
    const blocked = strokeBlocked.concat(imageBlocked)
    const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked)

    if (slots.length === 0) {
      y += LINE_HEIGHT
      continue
    }

    for (let si = 0; si < slots.length; si++) {
      const slot = slots[si]!
      const width = slot.right - slot.left
      let line = layoutNextLine(prepared, cursor, width)
      if (line === null) {
        cursor = { segmentIndex: 0, graphemeIndex: 0 }
        line = layoutNextLine(prepared, cursor, width)
        if (line === null) break
      }
      ctx.fillText(line.text, slot.left, bandTop)
      cursor = line.end
    }

    y += LINE_HEIGHT
  }
}

// --- Resize ---
function resize() {
  const dpr = window.devicePixelRatio || 1
  W = window.innerWidth
  H = window.innerHeight - BAR_HEIGHT
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.height = H + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  render()
}

// --- Hit test for images ---
function hitTestImage(x: number, y: number): PlacedImage | null {
  // Check in reverse order (top-most first)
  for (let i = placedImages.length - 1; i >= 0; i--) {
    const pi = placedImages[i]!
    if (x >= pi.x && x <= pi.x + pi.w && y >= pi.y && y <= pi.y + pi.h) {
      return pi
    }
  }
  return null
}

// --- Pinch to resize image ---
let pinchImage: PlacedImage | null = null
let pinchStartDist = 0
let pinchStartW = 0
let pinchStartH = 0
let isPinching = false

canvas.addEventListener('touchstart', function (e) {
  if (e.touches.length === 2) {
    // Check if both fingers are on an image
    const t0 = e.touches[0]!
    const t1 = e.touches[1]!
    const cx = (t0.clientX + t1.clientX) / 2
    const cy = (t0.clientY + t1.clientY) / 2
    const hit = hitTestImage(cx, cy)
    if (hit) {
      e.preventDefault()
      isPinching = true
      pinchImage = hit
      pinchStartDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
      pinchStartW = hit.w
      pinchStartH = hit.h
    }
  }
}, { passive: false })

canvas.addEventListener('touchmove', function (e) {
  if (isPinching && pinchImage && e.touches.length === 2) {
    e.preventDefault()
    const t0 = e.touches[0]!
    const t1 = e.touches[1]!
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
    const scale = dist / pinchStartDist
    const oldCx = pinchImage.x + pinchImage.w / 2
    const oldCy = pinchImage.y + pinchImage.h / 2
    pinchImage.w = Math.max(30, Math.min(W - 20, pinchStartW * scale))
    pinchImage.h = Math.max(30, Math.min(H - 20, pinchStartH * scale))
    // Keep centered
    pinchImage.x = oldCx - pinchImage.w / 2
    pinchImage.y = oldCy - pinchImage.h / 2
    render()
  }
}, { passive: false })

canvas.addEventListener('touchend', function (e) {
  if (isPinching && e.touches.length < 2) {
    isPinching = false
    pinchImage = null
  }
})

// --- Touch / pointer ---
let pointerDownTime = 0
let pointerDownPos = { x: 0, y: 0 }
let tappedImage: PlacedImage | null = null
let draggingImage: PlacedImage | null = null

canvas.addEventListener('pointerdown', function (e) {
  if (isPinching) return
  const x = e.clientX
  const y = e.clientY
  pointerDownTime = Date.now()
  pointerDownPos = { x, y }

  // Check if tapping an image
  const hit = hitTestImage(x, y)
  if (hit) {
    tappedImage = hit
    draggingImage = hit
    hit.dragging = true
    hit.dragOffsetX = x - hit.x
    hit.dragOffsetY = y - hit.y
    return
  }

  tappedImage = null
  draggingImage = null
  currentStroke = { points: [{ x, y }], style: penStyle }
  render()
})

canvas.addEventListener('pointermove', function (e) {
  if (isPinching) return
  const x = e.clientX
  const y = e.clientY

  if (draggingImage) {
    // If moved enough, it's a drag not a tap
    const dx = x - pointerDownPos.x
    const dy = y - pointerDownPos.y
    if (dx * dx + dy * dy > 100) {
      tappedImage = null // no longer a tap
      draggingImage.x = x - draggingImage.dragOffsetX
      draggingImage.y = y - draggingImage.dragOffsetY
      render()
    }
    return
  }

  if (currentStroke === null) return
  const pts = currentStroke.points
  const last = pts[pts.length - 1]!
  const dx = x - last.x
  const dy = y - last.y
  if (dx * dx + dy * dy > 16) {
    pts.push({ x, y })
    render()
  }
})

function pointerUp() {
  if (draggingImage) {
    draggingImage.dragging = false
    if (tappedImage && Date.now() - pointerDownTime < 300) {
      // Quick tap: cycle shape
      const idx = SHAPES.indexOf(tappedImage.shape)
      tappedImage.shape = SHAPES[(idx + 1) % SHAPES.length]!
    }
    draggingImage = null
    tappedImage = null
    render()
    return
  }

  if (currentStroke !== null && currentStroke.points.length > 0) {
    strokes.push(currentStroke)
  }
  currentStroke = null
}

canvas.addEventListener('pointerup', pointerUp)
canvas.addEventListener('pointercancel', pointerUp)

// --- Toolbar ---
const styleButtons = document.querySelectorAll('#bottom-bar button[data-style]')
styleButtons.forEach(function (btn) {
  btn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  btn.addEventListener('click', function (e) {
    e.stopPropagation()
    penStyle = (btn as HTMLElement).dataset.style as StrokeStyle
    styleButtons.forEach(function (b) { b.classList.remove('active') })
    btn.classList.add('active')
  })
})

// --- Upload button ---
const uploadBtn = document.getElementById('upload-btn')
const fileInput = document.getElementById('file-input') as HTMLInputElement
if (uploadBtn && fileInput) {
  uploadBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  uploadBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    fileInput.click()
  })
  fileInput.addEventListener('change', function () {
    const file = fileInput.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function () {
      const img = new Image()
      img.onload = function () {
        // Place image centered on screen, max 150px
        const maxSize = 150
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        const w = img.width * scale
        const h = img.height * scale
        placedImages.push({
          img, x: (W - w) / 2, y: (H - h) / 2, w, h,
          shape: 'original', dragging: false, dragOffsetX: 0, dragOffsetY: 0
        })
        render()
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
    fileInput.value = '' // allow re-uploading same file
  })
}

const resetBtn = document.getElementById('reset-btn')
if (resetBtn) {
  resetBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  resetBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    strokes.length = 0
    currentStroke = null
    placedImages.length = 0
    render()
  })
}

// --- Shake to fall ---
type FallingWord = {
  text: string
  x: number
  y: number
  vy: number
  vx: number
  landed: boolean
}
let fallingWords: FallingWord[] = []
let isFalling = false
let fallAnimId = 0

function triggerFall() {
  if (isFalling) return
  isFalling = true

  // First, do a normal layout pass to collect all visible lines
  if (prepared === null) return
  fallingWords = []

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = PADDING
  const maxY = H - PADDING

  while (y + LINE_HEIGHT <= maxY) {
    const bandTop = y
    const bandBottom = y + LINE_HEIGHT
    const strokeBlocked = getStrokeIntervalsForBand(bandTop, bandBottom)
    const imageBlocked = getImageIntervalsForBand(bandTop, bandBottom)
    const blocked = strokeBlocked.concat(imageBlocked)
    const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked)

    if (slots.length === 0) { y += LINE_HEIGHT; continue }

    for (let si = 0; si < slots.length; si++) {
      const slot = slots[si]!
      const width = slot.right - slot.left
      let line = layoutNextLine(prepared, cursor, width)
      if (line === null) {
        cursor = { segmentIndex: 0, graphemeIndex: 0 }
        line = layoutNextLine(prepared, cursor, width)
        if (line === null) break
      }
      // Split line into individual words for a more dramatic effect
      const words = line.text.split(' ')
      let wx = slot.left
      ctx.font = FONT
      for (let wi = 0; wi < words.length; wi++) {
        const word = words[wi]!
        if (word === '') continue
        const ww = ctx.measureText(word + ' ').width
        fallingWords.push({
          text: word,
          x: wx + (Math.random() - 0.5) * 2,
          y: bandTop,
          vy: Math.random() * 2,
          vx: (Math.random() - 0.5) * 3,
          landed: false,
        })
        wx += ww
      }
      cursor = line.end
    }
    y += LINE_HEIGHT
  }

  // Animate falling
  function animateFall() {
    ctx.clearRect(0, 0, W, H)

    // Draw images and strokes
    for (let i = 0; i < placedImages.length; i++) drawPlacedImage(placedImages[i]!)
    for (let si = 0; si < strokes.length; si++) drawStrokePath(strokes[si]!.points, strokes[si]!.style)

    ctx.font = FONT
    ctx.fillStyle = TEXT_COLOR
    ctx.textBaseline = 'top'
    ctx.globalAlpha = 1

    let allLanded = true
    const groundY = H - LINE_HEIGHT - 4

    for (let i = 0; i < fallingWords.length; i++) {
      const w = fallingWords[i]!
      if (!w.landed) {
        w.vy += 0.8 // gravity
        w.y += w.vy
        w.x += w.vx
        w.vx *= 0.98 // friction

        if (w.y >= groundY) {
          w.y = groundY
          w.vy = -w.vy * 0.3 // bounce
          if (Math.abs(w.vy) < 2) {
            w.landed = true
            w.vy = 0
          }
        }
        allLanded = false
      }
      ctx.fillText(w.text, w.x, w.y)
    }

    if (!allLanded) {
      fallAnimId = requestAnimationFrame(animateFall)
    } else {
      // Stay on ground for a moment, then reset
      setTimeout(function () {
        fallingWords = []
        isFalling = false
        render()
      }, 1500)
    }
  }

  fallAnimId = requestAnimationFrame(animateFall)
}

// Shake — tap button to enable motion, then shake phone to trigger fall
let shakeEnabled = false
let lastShakeTime = 0
const SHAKE_THRESHOLD = 25

function handleMotion(e: DeviceMotionEvent) {
  const acc = e.accelerationIncludingGravity
  if (!acc) return
  const force = Math.sqrt(
    (acc.x || 0) * (acc.x || 0) +
    (acc.y || 0) * (acc.y || 0) +
    (acc.z || 0) * (acc.z || 0)
  )
  if (force > SHAKE_THRESHOLD && Date.now() - lastShakeTime > 2000) {
    lastShakeTime = Date.now()
    triggerFall()
  }
}

const shakeBtn = document.getElementById('shake-btn')
if (shakeBtn) {
  shakeBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  shakeBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    if (shakeEnabled) {
      // Already enabled, tap triggers fall directly
      triggerFall()
      return
    }
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission().then(function (state: string) {
        if (state === 'granted') {
          window.addEventListener('devicemotion', handleMotion)
          shakeEnabled = true
          shakeBtn!.textContent = 'Shake ✓'
        }
      }).catch(function () {
        triggerFall()
      })
    } else {
      window.addEventListener('devicemotion', handleMotion)
      shakeEnabled = true
      shakeBtn!.textContent = 'Shake ✓'
    }
  })
}

// --- Boot ---
console.log('Text Playground: booting...')
try {
  prepared = prepareWithSegments((TEXT + ' ').repeat(6), FONT)
  console.log('Text Playground: prepared OK')
} catch (e) {
  console.error('prepareWithSegments failed:', e)
}
window.addEventListener('resize', resize)
resize()
console.log('Text Playground: ready')
