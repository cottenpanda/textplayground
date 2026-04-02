import {
  prepareWithSegments,
  layoutNextLine,
  type PreparedTextWithSegments,
  type LayoutCursor,
} from '../../pretext/src/layout.ts'

const PARAGRAPHS = [
  `This space is designed to help you move from scattered thoughts to clear direction. Whether you're exploring an idea, organizing your workflow, or refining details, everything stays flexible and easy to adjust. You can start simple, iterate quickly, and build structure over time without losing momentum. It's not about perfection—it's about making progress visible. Most ideas don't start fully formed. They begin as fragments—notes, sketches, questions. This space gives those fragments room to grow.`,
  `As you work, patterns start to emerge, decisions become clearer, and what once felt messy turns into something intentional. The goal isn't to force structure too early, but to let it happen naturally through iteration. Everything here is built to support clarity and flow. Information is organized in a way that helps you quickly understand what's happening, what needs attention, and what comes next. You can move between different states—exploring, editing, finalizing—without friction. The system adapts as your needs change, so you're never locked into a single way of working.`,
  `Sometimes the hardest part is simply starting. Once you begin, things shift. Ideas connect, directions form, and small steps add up. This space is meant to support that process quietly in the background—giving you just enough structure to stay grounded, while leaving room for exploration and change. Design is rarely a straight line. It moves between uncertainty and clarity, exploration and decision. This environment is built to support that rhythm—helping you navigate complexity, test ideas quickly, and shape outcomes with intention. Over time, what starts as ambiguity becomes something structured, thoughtful, and real.`,
]

const FONT = '16px "Source Code Pro", monospace'
const LINE_HEIGHT = 24
const PADDING = 16
const TEXT_COLOR = 'rgba(255, 255, 255, 0.82)'
const BAR_HEIGHT = 56
const FINGER_RADIUS = 40
const PARA_GAP = 16

// --- Canvas ---
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
let W = 0, H = 0

// --- Pretext prepared paragraphs ---
let preparedParas: PreparedTextWithSegments[] = []

let pointer: { x: number; y: number } | null = null

// --- Stroke tracking for path wrapping ---
type Stroke = Array<{ x: number; y: number }>
const strokes: Stroke[] = []
let currentStroke: Stroke | null = null
const PATH_RADIUS = 18 // how wide text avoids the drawn path

// --- Image state ---
type ImageShape = 'original' | 'circle' | 'heart' | 'square'
const SHAPES: ImageShape[] = ['original', 'circle', 'square']
type PlacedImage = {
  el: HTMLImageElement
  dataUrl: string
  x: number; y: number; w: number; h: number
  shape: ImageShape
  dragging: boolean
  dragOffsetX: number; dragOffsetY: number
  // Per-row alpha edges for transparent images (normalized 0-1)
  alphaEdges: Array<{ left: number; right: number } | null> | null
}
const placedImages: PlacedImage[] = []

// --- Alpha edge scanning ---
function scanAlphaEdges(img: HTMLImageElement): Array<{ left: number; right: number } | null> | null {
  const oc = new OffscreenCanvas(img.naturalWidth, img.naturalHeight)
  const octx = oc.getContext('2d')
  if (!octx) return null
  octx.drawImage(img, 0, 0)
  const { data, width, height } = octx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

  // Check if image has any transparency at all
  let hasTransparency = false
  for (let i = 3; i < data.length; i += 4) {
    if (data[i]! < 200) { hasTransparency = true; break }
  }
  if (!hasTransparency) return null // fully opaque, use rectangle

  const edges: Array<{ left: number; right: number } | null> = []
  for (let y = 0; y < height; y++) {
    let left = -1, right = -1
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3]! > 20) {
        if (left === -1) left = x
        right = x
      }
    }
    if (left === -1) {
      edges.push(null)
    } else {
      edges.push({ left: left / width, right: (right + 1) / width })
    }
  }
  return edges
}

// --- Interval math for pretext wrapping ---
type Interval = { left: number; right: number }

function getFingerIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  if (!pointer) return []
  const r = FINGER_RADIUS
  if (bandBottom < pointer.y - r || bandTop > pointer.y + r) return []
  let maxDx = 0
  for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
    const dy = sy - pointer.y
    const dxSq = r * r - dy * dy
    if (dxSq > 0) { const dx = Math.sqrt(dxSq); if (dx > maxDx) maxDx = dx }
  }
  if (maxDx <= 0) return []
  return [{ left: pointer.x - maxDx, right: pointer.x + maxDx }]
}

function getStrokeIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  const intervals: Interval[] = []
  const r = PATH_RADIUS
  const allStrokes = currentStroke ? strokes.concat([currentStroke]) : strokes

  for (let si = 0; si < allStrokes.length; si++) {
    const pts = allStrokes[si]!
    for (let pi = 0; pi < pts.length; pi++) {
      const p = pts[pi]!
      if (bandBottom < p.y - r || bandTop > p.y + r) continue
      const dy = Math.abs((bandTop + bandBottom) / 2 - p.y)
      const dxSq = r * r - dy * dy
      if (dxSq > 0) {
        const dx = Math.sqrt(dxSq)
        intervals.push({ left: p.x - dx, right: p.x + dx })
      }
      // Interpolate to fill gaps
      if (pi > 0) {
        const prev = pts[pi - 1]!
        const sdx = p.x - prev.x, sdy = p.y - prev.y
        const segLen = Math.sqrt(sdx * sdx + sdy * sdy)
        const step = r * 0.5
        if (segLen > step) {
          const count = Math.ceil(segLen / step)
          for (let s = 1; s < count; s++) {
            const t = s / count
            const ix = prev.x + sdx * t, iy = prev.y + sdy * t
            if (bandBottom < iy - r || bandTop > iy + r) continue
            const idy = Math.abs((bandTop + bandBottom) / 2 - iy)
            const idxSq = r * r - idy * idy
            if (idxSq > 0) {
              const idx = Math.sqrt(idxSq)
              intervals.push({ left: ix - idx, right: ix + idx })
            }
          }
        }
      }
    }
  }

  // Merge
  if (intervals.length <= 1) return intervals
  intervals.sort((a, b) => a.left - b.left)
  const merged: Interval[] = [intervals[0]!]
  for (let i = 1; i < intervals.length; i++) {
    const curr = intervals[i]!
    const last = merged[merged.length - 1]!
    if (curr.left <= last.right) { if (curr.right > last.right) last.right = curr.right }
    else merged.push(curr)
  }
  return merged
}

function getImageIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  const intervals: Interval[] = []
  const pad = 8
  for (let i = 0; i < placedImages.length; i++) {
    const img = placedImages[i]!
    const cx = img.x + img.w / 2
    const cy = img.y + img.h / 2
    const r = Math.min(img.w, img.h) / 2

    if (img.shape === 'original') {
      if (bandBottom <= img.y - pad || bandTop >= img.y + img.h + pad) continue
      if (img.alphaEdges) {
        // Use actual pixel edges
        const rows = img.alphaEdges.length
        const rowTop = Math.max(0, Math.floor(((bandTop - img.y) / img.h) * rows))
        const rowBot = Math.min(rows - 1, Math.ceil(((bandBottom - img.y) / img.h) * rows))
        let minL = Infinity, maxR = -Infinity
        for (let row = rowTop; row <= rowBot; row++) {
          const e = img.alphaEdges[row]
          if (e) {
            const l = img.x + e.left * img.w
            const r = img.x + e.right * img.w
            if (l < minL) minL = l
            if (r > maxR) maxR = r
          }
        }
        if (minL < maxR) intervals.push({ left: minL - pad, right: maxR + pad })
      } else {
        intervals.push({ left: img.x - pad, right: img.x + img.w + pad })
      }
    } else if (img.shape === 'square') {
      const side = Math.min(img.w, img.h)
      const sx = cx - side / 2, sy = cy - side / 2
      if (bandBottom <= sy - pad || bandTop >= sy + side + pad) continue
      intervals.push({ left: sx - pad, right: sx + side + pad })
    } else if (img.shape === 'circle') {
      if (bandBottom < cy - r - pad || bandTop > cy + r + pad) continue
      let maxDx = 0
      for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
        const dy = sy - cy
        const rp = r + pad
        const dxSq = rp * rp - dy * dy
        if (dxSq > 0) { const dx = Math.sqrt(dxSq); if (dx > maxDx) maxDx = dx }
      }
      if (maxDx > 0) intervals.push({ left: cx - maxDx, right: cx + maxDx })
    } else if (img.shape === 'heart') {
      if (bandBottom < cy - r * 1.3 - pad || bandTop > cy + r + pad) continue
      // Approximate heart width at this band
      let maxHW = 0
      for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
        const relY = (sy - (cy - r)) / (2 * r)
        let hw: number
        if (relY < 0.35) hw = r * (0.7 + 0.3 * Math.sin(relY / 0.35 * Math.PI))
        else hw = r * Math.max(0, 1.0 - (relY - 0.35) / 0.65)
        if (hw > maxHW) maxHW = hw
      }
      if (maxHW > 0) intervals.push({ left: cx - maxHW - pad, right: cx + maxHW + pad })
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

// --- Render using pretext ---
function render() {
  ctx.clearRect(0, 0, W, H)
  if (preparedParas.length === 0) return

  ctx.font = FONT
  ctx.fillStyle = TEXT_COLOR
  ctx.textBaseline = 'top'
  ctx.globalAlpha = 1

  let y = PADDING
  const maxY = H - PADDING

  for (let paraIdx = 0; paraIdx < preparedParas.length; paraIdx++) {
    const prepared = preparedParas[paraIdx]!
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
    let paraDone = false

    while (y + LINE_HEIGHT <= maxY && !paraDone) {
      const bandTop = y
      const bandBottom = y + LINE_HEIGHT
      const blocked = getImageIntervalsForBand(bandTop, bandBottom)
        .concat(getStrokeIntervalsForBand(bandTop, bandBottom))
        .concat(getFingerIntervalsForBand(bandTop, bandBottom))
      const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked)

      if (slots.length === 0) { y += LINE_HEIGHT; continue }

      for (let si = 0; si < slots.length; si++) {
        const slot = slots[si]!
        const width = slot.right - slot.left
        const line = layoutNextLine(prepared, cursor, width)
        if (line === null) { paraDone = true; break }
        ctx.fillText(line.text, slot.left, bandTop)
        cursor = line.end
      }
      y += LINE_HEIGHT
    }
    if (paraIdx < preparedParas.length - 1) y += PARA_GAP
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

// --- Image helpers ---
function getClipPath(shape: ImageShape, w: number, h: number): string {
  if (shape === 'circle') {
    // True circle using the shorter side
    const r = Math.min(w, h) / 2
    const rpw = (r / w) * 100
    const rph = (r / h) * 100
    return `ellipse(${rpw}% ${rph}% at 50% 50%)`
  }
  if (shape === 'heart') return 'path("M 50 90 C 15 55, 5 30, 25 15 C 35 8, 50 15, 50 30 C 50 15, 65 8, 75 15 C 95 30, 85 55, 50 90 Z")'
  if (shape === 'square') {
    const side = Math.min(w, h)
    const ox = ((w - side) / 2 / w) * 100
    const oy = ((h - side) / 2 / h) * 100
    return `inset(${oy}% ${ox}% ${oy}% ${ox}%)`
  }
  return 'none'
}

function syncImageEl(pi: PlacedImage) {
  pi.el.style.left = pi.x + 'px'
  pi.el.style.top = pi.y + 'px'
  pi.el.style.width = pi.w + 'px'
  pi.el.style.height = pi.h + 'px'
  const cp = getClipPath(pi.shape, pi.w, pi.h)
  pi.el.style.clipPath = cp === 'none' ? '' : cp
  ;(pi.el.style as any).webkitClipPath = cp === 'none' ? '' : cp
}

function hitTestImage(x: number, y: number): PlacedImage | null {
  for (let i = placedImages.length - 1; i >= 0; i--) {
    const pi = placedImages[i]!
    if (x >= pi.x && x <= pi.x + pi.w && y >= pi.y && y <= pi.y + pi.h) return pi
  }
  return null
}

// --- Pointer events ---
let pointerDownTime = 0
let pointerDownPos = { x: 0, y: 0 }
let tappedImage: PlacedImage | null = null
let draggingImage: PlacedImage | null = null

let isPinching = false
let pinchImage: PlacedImage | null = null
let pinchStartDist = 0
let pinchStartW = 0
let pinchStartH = 0

canvas.addEventListener('touchstart', function (e) {
  if (e.touches.length === 2) {
    const t0 = e.touches[0]!, t1 = e.touches[1]!
    const cx = (t0.clientX + t1.clientX) / 2, cy = (t0.clientY + t1.clientY) / 2
    const hit = hitTestImage(cx, cy)
    if (hit) {
      e.preventDefault()
      isPinching = true
      pinchImage = hit
      pinchStartDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
      pinchStartW = hit.w; pinchStartH = hit.h
    }
  }
}, { passive: false })

canvas.addEventListener('touchmove', function (e) {
  if (isPinching && pinchImage && e.touches.length === 2) {
    e.preventDefault()
    const t0 = e.touches[0]!, t1 = e.touches[1]!
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
    const scale = dist / pinchStartDist
    const oldCx = pinchImage.x + pinchImage.w / 2, oldCy = pinchImage.y + pinchImage.h / 2
    pinchImage.w = Math.max(30, Math.min(W - 20, pinchStartW * scale))
    pinchImage.h = Math.max(30, Math.min(H - 20, pinchStartH * scale))
    pinchImage.x = oldCx - pinchImage.w / 2; pinchImage.y = oldCy - pinchImage.h / 2
    syncImageEl(pinchImage)
    render()
  }
}, { passive: false })

canvas.addEventListener('touchend', function (e) {
  if (isPinching && e.touches.length < 2) { isPinching = false; pinchImage = null }
})

canvas.addEventListener('pointerdown', function (e) {
  if (isPinching) return
  const x = e.clientX, y = e.clientY
  pointerDownTime = Date.now(); pointerDownPos = { x, y }
  const hit = hitTestImage(x, y)
  if (hit) {
    tappedImage = hit; draggingImage = hit
    hit.dragging = true; hit.dragOffsetX = x - hit.x; hit.dragOffsetY = y - hit.y
    return
  }
  tappedImage = null; draggingImage = null
  pointer = { x, y }
  currentStroke = [{ x, y }]
  render()
})

canvas.addEventListener('pointermove', function (e) {
  if (isPinching) return
  const x = e.clientX, y = e.clientY
  if (draggingImage) {
    const dx = x - pointerDownPos.x, dy = y - pointerDownPos.y
    if (dx * dx + dy * dy > 100) {
      tappedImage = null
      draggingImage.x = x - draggingImage.dragOffsetX
      draggingImage.y = y - draggingImage.dragOffsetY
      syncImageEl(draggingImage)
      render()
    }
    return
  }
  if (pointer) {
    pointer = { x, y }
    if (currentStroke) {
      const last = currentStroke[currentStroke.length - 1]!
      if ((x - last.x) * (x - last.x) + (y - last.y) * (y - last.y) > 9) {
        currentStroke.push({ x, y })
        render()
      }
    }
    render()
  }
})

function pointerUp() {
  if (draggingImage) {
    draggingImage.dragging = false
    if (tappedImage && Date.now() - pointerDownTime < 300) {
      const idx = SHAPES.indexOf(tappedImage.shape)
      tappedImage.shape = SHAPES[(idx + 1) % SHAPES.length]!
      syncImageEl(tappedImage)
      render()
    }
    draggingImage = null; tappedImage = null; return
  }
  pointer = null
  if (currentStroke && currentStroke.length > 0) {
    strokes.push(currentStroke)
  }
  currentStroke = null
  render()
  render()
}
canvas.addEventListener('pointerup', pointerUp)
canvas.addEventListener('pointercancel', pointerUp)

// --- Upload ---
const uploadBtn = document.getElementById('upload-btn')
const fileInput = document.getElementById('file-input') as HTMLInputElement
if (uploadBtn && fileInput) {
  uploadBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  uploadBtn.addEventListener('click', function (e) { e.stopPropagation(); fileInput.click() })
  fileInput.addEventListener('change', function () {
    const file = fileInput.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function () {
      const dataUrl = reader.result as string
      const img = new Image()
      img.onload = function () {
        const maxSize = 150
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        const w = img.width * scale, h = img.height * scale
        const el = document.createElement('img')
        el.src = dataUrl
        el.className = 'placed-image'
        el.style.cssText = 'position:fixed;pointer-events:none;z-index:2;'
        document.body.appendChild(el)
        const alphaEdges = scanAlphaEdges(img)
        const placed: PlacedImage = {
          el, dataUrl, x: (W - w) / 2, y: (H - h) / 2, w, h,
          shape: 'original', dragging: false, dragOffsetX: 0, dragOffsetY: 0,
          alphaEdges,
        }
        syncImageEl(placed)
        placedImages.push(placed)
        render()
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
    fileInput.value = ''
  })
}

// --- Shake ---
type FallingWord = { text: string; x: number; y: number; vy: number; vx: number; landed: boolean }
let fallingWords: FallingWord[] = []
let isFalling = false

function collectVisibleWords(): FallingWord[] {
  const result: FallingWord[] = []
  if (preparedParas.length === 0) return result
  ctx.font = FONT
  let y = PADDING
  const maxY = H - PADDING
  for (let paraIdx = 0; paraIdx < preparedParas.length; paraIdx++) {
    const prepared = preparedParas[paraIdx]!
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
    let paraDone = false
    while (y + LINE_HEIGHT <= maxY && !paraDone) {
      const bandTop = y
      const bandBottom = y + LINE_HEIGHT
      const blocked = getImageIntervalsForBand(bandTop, bandBottom)
        .concat(getStrokeIntervalsForBand(bandTop, bandBottom))
      const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked)
      if (slots.length === 0) { y += LINE_HEIGHT; continue }
      for (let si = 0; si < slots.length; si++) {
        const slot = slots[si]!
        const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
        if (line === null) { paraDone = true; break }
        const lineWords = line.text.split(' ')
        let wx = slot.left
        for (const word of lineWords) {
          if (word === '') continue
          const wm = ctx.measureText(word + ' ').width
          result.push({ text: word, x: wx, y: bandTop, vy: Math.random() * 2, vx: (Math.random() - 0.5) * 3, landed: false })
          wx += wm
        }
        cursor = line.end
      }
      y += LINE_HEIGHT
    }
    if (paraIdx < preparedParas.length - 1) y += PARA_GAP
  }
  return result
}

function triggerFall() {
  if (isFalling) return
  isFalling = true
  fallingWords = collectVisibleWords()
  function animateFall() {
    ctx.clearRect(0, 0, W, H)
    ctx.font = FONT; ctx.fillStyle = TEXT_COLOR; ctx.textBaseline = 'top'
    let allLanded = true
    const groundY = H - LINE_HEIGHT - 4
    for (let i = 0; i < fallingWords.length; i++) {
      const fw = fallingWords[i]!
      if (!fw.landed) {
        fw.vy += 0.8; fw.y += fw.vy; fw.x += fw.vx; fw.vx *= 0.98
        if (fw.y >= groundY) { fw.y = groundY; fw.vy = -fw.vy * 0.3; if (Math.abs(fw.vy) < 2) { fw.landed = true; fw.vy = 0 } }
        allLanded = false
      }
      ctx.fillText(fw.text, fw.x, fw.y)
    }
    if (!allLanded) { requestAnimationFrame(animateFall) }
    else { setTimeout(function () { fallingWords = []; isFalling = false; render() }, 1500) }
  }
  requestAnimationFrame(animateFall)
}

const shakeBtn = document.getElementById('shake-btn')
if (shakeBtn) {
  shakeBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  shakeBtn.addEventListener('click', function (e) { e.stopPropagation(); triggerFall() })
}

// --- Reset ---
const resetBtn = document.getElementById('reset-btn')
if (resetBtn) {
  resetBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  resetBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    for (let i = 0; i < placedImages.length; i++) placedImages[i]!.el.remove()
    placedImages.length = 0; pointer = null; strokes.length = 0; currentStroke = null
    render()
  })
}

// --- Boot ---
try {
  for (let i = 0; i < PARAGRAPHS.length; i++) {
    preparedParas.push(prepareWithSegments(PARAGRAPHS[i]!, FONT))
  }
} catch (e) { console.error('prepareWithSegments failed:', e) }
window.addEventListener('resize', resize)
resize()
console.log('Text Playground: ready')
