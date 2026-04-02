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

type Mode = 'mobile' | 'desktop'
let mode: Mode = 'mobile'

const FONT = '16px "Source Code Pro", monospace'
const LINE_HEIGHT = 24
const PADDING = 16
const TEXT_COLOR = 'rgba(255, 255, 255, 0.82)'
const BAR_HEIGHT = 56
const TOP_BAR_HEIGHT = 44
const FINGER_RADIUS = 40
const PARA_GAP = 16

// Desktop magazine config
const DESK_FONT = '15px "Source Serif 4", Georgia, serif'
const DESK_LINE_HEIGHT = 24
const DESK_PAD = 48
const DESK_PARA_GAP = 18
const DESK_TEXT_COLOR = 'rgba(255, 255, 255, 0.75)'
const DESK_COL_GAP = 40
const DESK_TITLE_FONT = '72px "Playfair Display", Georgia, serif'
const DESK_TITLE_LH = 78
const DESK_SUB_FONT = 'italic 20px "Playfair Display", Georgia, serif'
const QUOTE_TEXT = 'Simplicity is about subtracting the obvious and adding the meaningful.'
const QUOTE_FONT = 'bold 24px "Playfair Display", Georgia, serif'
const QUOTE_LH = 34
const QUOTE_COLOR = '#f2c4b8'
let preparedQuote: PreparedTextWithSegments | null = null
let preparedTitle: PreparedTextWithSegments | null = null
let preparedSub: PreparedTextWithSegments | null = null
const TITLE_TEXT = 'Text Play'
const SUB_TEXT = 'An interactive typography experiment'

// --- Auto-moving image (desktop) ---
let autoImgEl: HTMLImageElement | null = null
let autoImgX = 0
let autoImgY = 0
let autoImgW = 150
let autoImgH = 150
let autoImgVx = 1.5
let autoImgVy = 1.0
let autoImgActive = false
let autoImgAlphaEdges: Array<{ left: number; right: number } | null> | null = null

// --- Draggable pull quote ---
const QUOTE_W = 260
const QUOTE_H = 220
let quoteX = 0
let quoteY = 0
let quoteDragging = false
let quoteDragOffX = 0
let quoteDragOffY = 0

// --- Canvas ---
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
let W = 0, H = 0

// --- Pretext prepared paragraphs ---
let preparedParas: PreparedTextWithSegments[] = []
let preparedDesk: PreparedTextWithSegments[] = []

let pointer: { x: number; y: number } | null = null
let desktopMouse: { x: number; y: number } | null = null

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

// --- Quote interval for body text wrapping (per-line width) ---
const QLINES_META = [
  { font: 'bold 18px "Playfair Display"', text: 'SIMPLICITY IS ABOUT', yOff: 16, h: 28 },
  { font: 'bold 22px "Playfair Display"', text: 'SUBTRACTING THE', yOff: 44, h: 32 },
  { font: 'bold 36px "Playfair Display"', text: 'OBVIOUS', yOff: 76, h: 42 },
  { font: 'bold 22px "Playfair Display"', text: 'AND ADDING THE', yOff: 118, h: 34 },
  { font: 'bold 40px "Playfair Display"', text: 'MEANINGFUL.', yOff: 152, h: 48 },
]

let quoteLineWidths: number[] = []
function cacheQuoteWidths() {
  quoteLineWidths = []
  for (const ql of QLINES_META) {
    ctx.font = ql.font
    quoteLineWidths.push(ctx.measureText(ql.text).width)
  }
}

function getQuoteIntervalForBand(bandTop: number, bandBottom: number): Interval[] {
  if (mode !== 'desktop') return []
  const pad = 4
  const cx = quoteX + QUOTE_W / 2
  const first = QLINES_META[0]!
  const last = QLINES_META[QLINES_META.length - 1]!
  const qTop = quoteY + first.yOff
  const qBot = quoteY + last.yOff + last.h

  // Not in quote range at all
  if (bandBottom <= qTop - 2 || bandTop >= qBot + 2) return []

  // Find the widest overlapping quote line for this band
  // Use cached widths so we don't mutate ctx.font
  let maxHalfW = 0
  for (let i = 0; i < QLINES_META.length; i++) {
    const ql = QLINES_META[i]!
    const lineTop = quoteY + ql.yOff
    const lineBot = lineTop + ql.h
    if (bandBottom > lineTop - pad && bandTop < lineBot + pad) {
      if (quoteLineWidths[i]! / 2 > maxHalfW) maxHalfW = quoteLineWidths[i]! / 2
    }
  }

  // If between lines (gap), use nearest line's width
  if (maxHalfW === 0) {
    const bandMid = (bandTop + bandBottom) / 2
    let minDist = Infinity
    for (let i = 0; i < QLINES_META.length; i++) {
      const lineMid = quoteY + QLINES_META[i]!.yOff + QLINES_META[i]!.h / 2
      const d = Math.abs(bandMid - lineMid)
      if (d < minDist) { minDist = d; maxHalfW = quoteLineWidths[i]! / 2 }
    }
  }

  if (maxHalfW <= 0) return []
  return [{ left: cx - maxHalfW - pad, right: cx + maxHalfW + pad }]
}

// --- Auto-moving image interval (reuses alpha edges like mobile) ---
function getAutoImgIntervalForBand(bandTop: number, bandBottom: number): Interval[] {
  if (!autoImgActive) return []
  const pad = 8
  if (bandBottom <= autoImgY - pad || bandTop >= autoImgY + autoImgH + pad) return []
  if (autoImgAlphaEdges) {
    const rows = autoImgAlphaEdges.length
    const rowTop = Math.max(0, Math.floor(((bandTop - autoImgY) / autoImgH) * rows))
    const rowBot = Math.min(rows - 1, Math.ceil(((bandBottom - autoImgY) / autoImgH) * rows))
    let minL = Infinity, maxR = -Infinity
    for (let row = rowTop; row <= rowBot; row++) {
      const e = autoImgAlphaEdges[row]
      if (e) {
        const l = autoImgX + e.left * autoImgW
        const r = autoImgX + e.right * autoImgW
        if (l < minL) minL = l
        if (r > maxR) maxR = r
      }
    }
    if (minL < maxR) return [{ left: minL - pad, right: maxR + pad }]
    return []
  }
  return [{ left: autoImgX - pad, right: autoImgX + autoImgW + pad }]
}

// --- Heat map color ---
const HEAT_RADIUS = 250

function heatColor(wx: number, wy: number, baseColor: string): string {
  if (!desktopMouse) return baseColor
  const dx = wx - desktopMouse.x
  const dy = wy - desktopMouse.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > HEAT_RADIUS) return baseColor

  const t = 1 - dist / HEAT_RADIUS // 1 = hot (close), 0 = cool (far)

  // Cool (base) -> warm yellow -> orange -> red
  if (t < 0.3) {
    // base -> warm white
    const s = t / 0.3
    const r = Math.round(180 + 75 * s)
    const g = Math.round(180 + 55 * s)
    const b = Math.round(200 - 80 * s)
    return `rgb(${r},${g},${b})`
  } else if (t < 0.6) {
    // warm white -> orange
    const s = (t - 0.3) / 0.3
    const r = 255
    const g = Math.round(235 - 120 * s)
    const b = Math.round(120 - 90 * s)
    return `rgb(${r},${g},${b})`
  } else {
    // orange -> red
    const s = (t - 0.6) / 0.4
    const r = 255
    const g = Math.round(115 - 80 * s)
    const b = Math.round(30 + 20 * s)
    return `rgb(${r},${g},${b})`
  }
}

// --- Desktop column helper ---
function deskColumn(
  paras: PreparedTextWithSegments[],
  startPara: number, startCursor: LayoutCursor,
  left: number, right: number, startY: number, maxY: number,
  font: string, lh: number, pg: number, color: string,
): { paraIdx: number; cursor: LayoutCursor; y: number } {
  ctx.font = font
  let y = startY
  let paraIdx = startPara
  let cursor = startCursor
  const spaceW = ctx.measureText(' ').width

  while (paraIdx < paras.length) {
    const prepared = paras[paraIdx]!
    let done = false
    while (y + lh <= maxY && !done) {
      const bandTop = y
      const bandBottom = y + lh
      const blocked = getQuoteIntervalForBand(bandTop, bandBottom)
        .concat(getAutoImgIntervalForBand(bandTop, bandBottom))
      const slots = carveSlots({ left, right }, blocked)

      if (slots.length === 0) { y += lh; continue }

      for (let si = 0; si < slots.length; si++) {
        const slot = slots[si]!
        const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
        if (line === null) { done = true; break }

        // Render with heat color + 3D sphere displacement
        if (desktopMouse) {
          const words = line.text.split(' ')
          let wx = slot.left
          ctx.font = font
          for (let wi = 0; wi < words.length; wi++) {
            const word = words[wi]!
            if (word === '') continue
            const ww = ctx.measureText(word).width
            const wcx = wx + ww / 2
            const wcy = y + lh / 2
            const dx = wcx - desktopMouse.x
            const dy = wcy - desktopMouse.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const R = HEAT_RADIUS

            let ox = 0, oy = 0
            if (dist < R && dist > 0.1) {
              const t = 1 - dist / R
              const push = t * t * 30
              ox = (dx / dist) * push
              oy = (dy / dist) * push
            }

            ctx.fillStyle = heatColor(wcx, wcy, color)
            ctx.fillText(word, wx + ox, y + oy)
            wx += ww + spaceW
          }
        } else {
          ctx.fillStyle = color
          ctx.fillText(line.text, slot.left, y)
        }

        cursor = line.end
      }
      y += lh
    }
    if (done) {
      paraIdx++
      cursor = { segmentIndex: 0, graphemeIndex: 0 }
      if (paraIdx < paras.length) y += pg
    } else break
  }
  return { paraIdx, cursor, y }
}

// --- Render using pretext ---
function render() {
  ctx.clearRect(0, 0, W, H)
  ctx.textBaseline = 'top'
  ctx.globalAlpha = 1

  const topOffset = TOP_BAR_HEIGHT

  if (mode === 'mobile') {
    if (preparedParas.length === 0) return
    ctx.font = FONT
    ctx.fillStyle = TEXT_COLOR

    let y = PADDING + topOffset
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
  } else {
    // --- Desktop: 3-column magazine ---
    if (preparedDesk.length === 0) return
    const pad = DESK_PAD
    const gap = DESK_COL_GAP
    const colWidth = (W - pad * 2 - gap * 2) / 3
    const col1L = pad, col1R = col1L + colWidth
    const col2L = col1R + gap, col2R = col2L + colWidth
    const col3L = col2R + gap, col3R = col3L + colWidth
    const startY = pad + topOffset
    const maxY = H - pad

    // Column dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    for (const dx of [(col1R + col2L) / 2, (col2R + col3L) / 2]) {
      ctx.beginPath(); ctx.moveTo(dx, startY); ctx.lineTo(dx, maxY); ctx.stroke()
    }

    // Column 1: headline + subtitle (using pretext, wraps around obstacles)
    let c1y = startY

    // Title
    if (preparedTitle) {
      ctx.font = DESK_TITLE_FONT
      ctx.fillStyle = '#ffffff'
      let titleCursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
      while (c1y + DESK_TITLE_LH <= maxY) {
        const blocked = getQuoteIntervalForBand(c1y, c1y + DESK_TITLE_LH)
          .concat(getAutoImgIntervalForBand(c1y, c1y + DESK_TITLE_LH))
        const slots = carveSlots({ left: col1L, right: col1R }, blocked)
        if (slots.length === 0) { c1y += DESK_TITLE_LH; continue }
        const line = layoutNextLine(preparedTitle, titleCursor, slots[0]!.right - slots[0]!.left)
        if (line === null) break
        ctx.fillStyle = heatColor(slots[0]!.left + line.width / 2, c1y + DESK_TITLE_LH / 2, '#ffffff')
        ctx.fillText(line.text, slots[0]!.left, c1y)
        titleCursor = line.end
        c1y += DESK_TITLE_LH
      }
      c1y += 8
    }

    // Subtitle
    if (preparedSub) {
      ctx.font = DESK_SUB_FONT
      const subLH = 26
      let subCursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
      while (c1y + subLH <= maxY) {
        const blocked = getQuoteIntervalForBand(c1y, c1y + subLH)
          .concat(getAutoImgIntervalForBand(c1y, c1y + subLH))
        const slots = carveSlots({ left: col1L, right: col1R }, blocked)
        if (slots.length === 0) { c1y += subLH; continue }
        const line = layoutNextLine(preparedSub, subCursor, slots[0]!.right - slots[0]!.left)
        if (line === null) break
        ctx.fillStyle = heatColor(slots[0]!.left + line.width / 2, c1y + subLH / 2, 'rgba(255,255,255,0.45)')
        ctx.fillText(line.text, slots[0]!.left, c1y)
        subCursor = line.end
        c1y += subLH
      }
      c1y += 14
    }

    // Rule
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath(); ctx.moveTo(col1L, c1y); ctx.lineTo(col1R, c1y); ctx.stroke()
    c1y += 16

    const r1 = deskColumn(preparedDesk, 0, { segmentIndex: 0, graphemeIndex: 0 },
      col1L, col1R, c1y, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR)

    // Column 2
    const r2 = deskColumn(preparedDesk, r1.paraIdx, r1.cursor,
      col2L, col2R, startY, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR)

    // Column 3
    deskColumn(preparedDesk, r2.paraIdx, r2.cursor,
      col3L, col3R, startY, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR)

    // --- Draggable pull quote (styled, fixed layout) ---
    const qcx = quoteX + QUOTE_W / 2
    ctx.textAlign = 'center'

    const qLines = [
      { text: 'SIMPLICITY IS ABOUT', font: 'bold 18px "Playfair Display"', color: '#f2c4b8', yOff: 16 },
      { text: 'SUBTRACTING THE', font: 'bold 22px "Playfair Display"', color: '#f2c4b8', yOff: 44 },
      { text: 'OBVIOUS', font: 'bold 36px "Playfair Display"', color: '#e8ddd4', yOff: 76 },
      { text: 'AND ADDING THE', font: 'bold 22px "Playfair Display"', color: '#ffffff', yOff: 118 },
      { text: 'MEANINGFUL.', font: 'bold 40px "Playfair Display"', color: '#7ed695', yOff: 152 },
    ]

    for (const ql of qLines) {
      ctx.font = ql.font
      ctx.fillStyle = ql.color
      ctx.fillText(ql.text, qcx, quoteY + ql.yOff)
    }
    ctx.textAlign = 'left'
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

  // Check quote drag in desktop mode
  if (mode === 'desktop' && x >= quoteX && x <= quoteX + QUOTE_W && y >= quoteY && y <= quoteY + QUOTE_H) {
    quoteDragging = true
    quoteDragOffX = x - quoteX
    quoteDragOffY = y - quoteY
    return
  }

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

  if (quoteDragging) {
    quoteX = x - quoteDragOffX
    quoteY = y - quoteDragOffY
    render()
    return
  }

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
  if (quoteDragging) {
    quoteDragging = false
    render()
    return
  }
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

        if (mode === 'desktop') {
          // Desktop: auto-moving image
          if (autoImgEl) autoImgEl.remove()
          const el = document.createElement('img')
          el.src = dataUrl
          el.style.cssText = 'position:fixed;pointer-events:none;z-index:2;object-fit:contain;'
          document.body.appendChild(el)
          autoImgEl = el
          autoImgW = w; autoImgH = h
          autoImgAlphaEdges = scanAlphaEdges(img)
          autoImgX = DESK_PAD
          autoImgY = TOP_BAR_HEIGHT + DESK_PAD + 40
          autoImgActive = true
          syncAutoImgEl()
          startAutoImgAnim()
        } else {
          // Mobile: static placed image
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
    stopAutoImgAnim()
    render()
  })
}

// --- Mode toggle ---
const modeMobileBtn = document.getElementById('mode-mobile')
const modeDesktopBtn = document.getElementById('mode-desktop')
function setMode(m: Mode) {
  mode = m
  if (m === 'desktop') {
    quoteX = W - DESK_PAD - QUOTE_W
    quoteY = H / 2
    if (autoImgActive) startAutoImgAnim()
  } else {
    stopAutoImgAnim()
  }
  if (modeMobileBtn && modeDesktopBtn) {
    modeMobileBtn.classList.toggle('mode-active', m === 'mobile')
    modeDesktopBtn.classList.toggle('mode-active', m === 'desktop')
  }
  render()
}
if (modeMobileBtn) {
  modeMobileBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  modeMobileBtn.addEventListener('click', function (e) { e.stopPropagation(); setMode('mobile') })
}
if (modeDesktopBtn) {
  modeDesktopBtn.addEventListener('pointerdown', function (e) { e.stopPropagation() })
  modeDesktopBtn.addEventListener('click', function (e) { e.stopPropagation(); setMode('desktop') })
}

// --- Auto-moving image animation ---
function syncAutoImgEl() {
  if (!autoImgEl) return
  autoImgEl.style.left = autoImgX + 'px'
  autoImgEl.style.top = autoImgY + 'px'
  autoImgEl.style.width = autoImgW + 'px'
  autoImgEl.style.height = autoImgH + 'px'
}

let autoImgAnimId = 0
function startAutoImgAnim() {
  function tick() {
    if (!autoImgActive || mode !== 'desktop') { autoImgAnimId = 0; return }

    autoImgX += autoImgVx
    autoImgY += autoImgVy
    const minX = DESK_PAD
    const maxX = W - DESK_PAD - autoImgW
    const minY = TOP_BAR_HEIGHT + DESK_PAD
    const maxYB = H - DESK_PAD - autoImgH
    if (autoImgX <= minX || autoImgX >= maxX) autoImgVx = -autoImgVx
    if (autoImgY <= minY || autoImgY >= maxYB) autoImgVy = -autoImgVy
    autoImgX = Math.max(minX, Math.min(maxX, autoImgX))
    autoImgY = Math.max(minY, Math.min(maxYB, autoImgY))

    syncAutoImgEl()
    render()
    autoImgAnimId = requestAnimationFrame(tick)
  }
  if (!autoImgAnimId) autoImgAnimId = requestAnimationFrame(tick)
}

function stopAutoImgAnim() {
  if (autoImgEl) { autoImgEl.remove(); autoImgEl = null }
  autoImgActive = false
  autoImgAnimId = 0
}

// --- Desktop mouse tracking for heat map ---
canvas.addEventListener('mousemove', function (e) {
  if (mode === 'desktop') {
    // Ignore when mouse is near top bar or bottom bar
    if (e.clientY < TOP_BAR_HEIGHT + 10 || e.clientY > H - 10) {
      if (desktopMouse) { desktopMouse = null; render() }
      return
    }
    desktopMouse = { x: e.clientX, y: e.clientY }
    render()
  }
})
canvas.addEventListener('mouseleave', function () {
  desktopMouse = null
  if (mode === 'desktop') render()
})

// --- Boot ---
quoteX = 600
quoteY = 300
try {
  for (let i = 0; i < PARAGRAPHS.length; i++) {
    preparedParas.push(prepareWithSegments(PARAGRAPHS[i]!, FONT))
    preparedDesk.push(prepareWithSegments(PARAGRAPHS[i]!, DESK_FONT))
  }
  preparedQuote = prepareWithSegments(QUOTE_TEXT, QUOTE_FONT)
  preparedTitle = prepareWithSegments(TITLE_TEXT, DESK_TITLE_FONT)
  preparedSub = prepareWithSegments(SUB_TEXT, DESK_SUB_FONT)
  cacheQuoteWidths()
} catch (e) { console.error('prepareWithSegments failed:', e) }
window.addEventListener('resize', resize)
resize()
console.log('Text Playground: ready')
