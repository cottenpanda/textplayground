// ../../pretext/src/bidi.ts
var baseTypes = [
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "S",
  "B",
  "S",
  "WS",
  "B",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "B",
  "B",
  "B",
  "S",
  "WS",
  "ON",
  "ON",
  "ET",
  "ET",
  "ET",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "CS",
  "ON",
  "CS",
  "ON",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "EN",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "B",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "BN",
  "CS",
  "ON",
  "ET",
  "ET",
  "ET",
  "ET",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "ET",
  "ET",
  "EN",
  "EN",
  "ON",
  "L",
  "ON",
  "ON",
  "ON",
  "EN",
  "L",
  "ON",
  "ON",
  "ON",
  "ON",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "ON",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L",
  "L"
];
var arabicTypes = [
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "CS",
  "AL",
  "ON",
  "ON",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "AN",
  "ET",
  "AN",
  "AN",
  "AL",
  "AL",
  "AL",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "ON",
  "NSM",
  "NSM",
  "NSM",
  "NSM",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL",
  "AL"
];
function classifyChar(charCode) {
  if (charCode <= 255)
    return baseTypes[charCode];
  if (1424 <= charCode && charCode <= 1524)
    return "R";
  if (1536 <= charCode && charCode <= 1791)
    return arabicTypes[charCode & 255];
  if (1792 <= charCode && charCode <= 2220)
    return "AL";
  return "L";
}
function computeBidiLevels(str) {
  const len = str.length;
  if (len === 0)
    return null;
  const types = new Array(len);
  let numBidi = 0;
  for (let i = 0;i < len; i++) {
    const t = classifyChar(str.charCodeAt(i));
    if (t === "R" || t === "AL" || t === "AN")
      numBidi++;
    types[i] = t;
  }
  if (numBidi === 0)
    return null;
  const startLevel = len / numBidi < 0.3 ? 0 : 1;
  const levels = new Int8Array(len);
  for (let i = 0;i < len; i++)
    levels[i] = startLevel;
  const e = startLevel & 1 ? "R" : "L";
  const sor = e;
  let lastType = sor;
  for (let i = 0;i < len; i++) {
    if (types[i] === "NSM")
      types[i] = lastType;
    else
      lastType = types[i];
  }
  lastType = sor;
  for (let i = 0;i < len; i++) {
    const t = types[i];
    if (t === "EN")
      types[i] = lastType === "AL" ? "AN" : "EN";
    else if (t === "R" || t === "L" || t === "AL")
      lastType = t;
  }
  for (let i = 0;i < len; i++) {
    if (types[i] === "AL")
      types[i] = "R";
  }
  for (let i = 1;i < len - 1; i++) {
    if (types[i] === "ES" && types[i - 1] === "EN" && types[i + 1] === "EN") {
      types[i] = "EN";
    }
    if (types[i] === "CS" && (types[i - 1] === "EN" || types[i - 1] === "AN") && types[i + 1] === types[i - 1]) {
      types[i] = types[i - 1];
    }
  }
  for (let i = 0;i < len; i++) {
    if (types[i] !== "EN")
      continue;
    let j;
    for (j = i - 1;j >= 0 && types[j] === "ET"; j--)
      types[j] = "EN";
    for (j = i + 1;j < len && types[j] === "ET"; j++)
      types[j] = "EN";
  }
  for (let i = 0;i < len; i++) {
    const t = types[i];
    if (t === "WS" || t === "ES" || t === "ET" || t === "CS")
      types[i] = "ON";
  }
  lastType = sor;
  for (let i = 0;i < len; i++) {
    const t = types[i];
    if (t === "EN")
      types[i] = lastType === "L" ? "L" : "EN";
    else if (t === "R" || t === "L")
      lastType = t;
  }
  for (let i = 0;i < len; i++) {
    if (types[i] !== "ON")
      continue;
    let end = i + 1;
    while (end < len && types[end] === "ON")
      end++;
    const before = i > 0 ? types[i - 1] : sor;
    const after = end < len ? types[end] : sor;
    const bDir = before !== "L" ? "R" : "L";
    const aDir = after !== "L" ? "R" : "L";
    if (bDir === aDir) {
      for (let j = i;j < end; j++)
        types[j] = bDir;
    }
    i = end - 1;
  }
  for (let i = 0;i < len; i++) {
    if (types[i] === "ON")
      types[i] = e;
  }
  for (let i = 0;i < len; i++) {
    const t = types[i];
    if ((levels[i] & 1) === 0) {
      if (t === "R")
        levels[i]++;
      else if (t === "AN" || t === "EN")
        levels[i] += 2;
    } else if (t === "L" || t === "AN" || t === "EN") {
      levels[i]++;
    }
  }
  return levels;
}
function computeSegmentLevels(normalized, segStarts) {
  const bidiLevels = computeBidiLevels(normalized);
  if (bidiLevels === null)
    return null;
  const segLevels = new Int8Array(segStarts.length);
  for (let i = 0;i < segStarts.length; i++) {
    segLevels[i] = bidiLevels[segStarts[i]];
  }
  return segLevels;
}

// ../../pretext/src/analysis.ts
var collapsibleWhitespaceRunRe = /[ \t\n\r\f]+/g;
var needsWhitespaceNormalizationRe = /[\t\n\r\f]| {2,}|^ | $/;
function getWhiteSpaceProfile(whiteSpace) {
  const mode = whiteSpace ?? "normal";
  return mode === "pre-wrap" ? { mode, preserveOrdinarySpaces: true, preserveHardBreaks: true } : { mode, preserveOrdinarySpaces: false, preserveHardBreaks: false };
}
function normalizeWhitespaceNormal(text) {
  if (!needsWhitespaceNormalizationRe.test(text))
    return text;
  let normalized = text.replace(collapsibleWhitespaceRunRe, " ");
  if (normalized.charCodeAt(0) === 32) {
    normalized = normalized.slice(1);
  }
  if (normalized.length > 0 && normalized.charCodeAt(normalized.length - 1) === 32) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
function normalizeWhitespacePreWrap(text) {
  if (!/[\r\f]/.test(text))
    return text.replace(/\r\n/g, `
`);
  return text.replace(/\r\n/g, `
`).replace(/[\r\f]/g, `
`);
}
var sharedWordSegmenter = null;
var segmenterLocale;
function getSharedWordSegmenter() {
  if (sharedWordSegmenter === null) {
    sharedWordSegmenter = new Intl.Segmenter(segmenterLocale, { granularity: "word" });
  }
  return sharedWordSegmenter;
}
var arabicScriptRe = /\p{Script=Arabic}/u;
var combiningMarkRe = /\p{M}/u;
var decimalDigitRe = /\p{Nd}/u;
function containsArabicScript(text) {
  return arabicScriptRe.test(text);
}
function isCJK(s) {
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 19968 && c <= 40959 || c >= 13312 && c <= 19903 || c >= 131072 && c <= 173791 || c >= 173824 && c <= 177983 || c >= 177984 && c <= 178207 || c >= 178208 && c <= 183983 || c >= 183984 && c <= 191471 || c >= 196608 && c <= 201551 || c >= 63744 && c <= 64255 || c >= 194560 && c <= 195103 || c >= 12288 && c <= 12351 || c >= 12352 && c <= 12447 || c >= 12448 && c <= 12543 || c >= 44032 && c <= 55215 || c >= 65280 && c <= 65519) {
      return true;
    }
  }
  return false;
}
var kinsokuStart = new Set([
  "，",
  "．",
  "！",
  "：",
  "；",
  "？",
  "、",
  "。",
  "・",
  "）",
  "〕",
  "〉",
  "》",
  "」",
  "』",
  "】",
  "〗",
  "〙",
  "〛",
  "ー",
  "々",
  "〻",
  "ゝ",
  "ゞ",
  "ヽ",
  "ヾ"
]);
var kinsokuEnd = new Set([
  '"',
  "(",
  "[",
  "{",
  "“",
  "‘",
  "«",
  "‹",
  "（",
  "〔",
  "〈",
  "《",
  "「",
  "『",
  "【",
  "〖",
  "〘",
  "〚"
]);
var forwardStickyGlue = new Set([
  "'",
  "’"
]);
var leftStickyPunctuation = new Set([
  ".",
  ",",
  "!",
  "?",
  ":",
  ";",
  "،",
  "؛",
  "؟",
  "।",
  "॥",
  "၊",
  "။",
  "၌",
  "၍",
  "၏",
  ")",
  "]",
  "}",
  "%",
  '"',
  "”",
  "’",
  "»",
  "›",
  "…"
]);
var arabicNoSpaceTrailingPunctuation = new Set([
  ":",
  ".",
  "،",
  "؛"
]);
var myanmarMedialGlue = new Set([
  "၏"
]);
var closingQuoteChars = new Set([
  "”",
  "’",
  "»",
  "›",
  "」",
  "』",
  "】",
  "》",
  "〉",
  "〕",
  "）"
]);
function isLeftStickyPunctuationSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment))
    return true;
  let sawPunctuation = false;
  for (const ch of segment) {
    if (leftStickyPunctuation.has(ch)) {
      sawPunctuation = true;
      continue;
    }
    if (sawPunctuation && combiningMarkRe.test(ch))
      continue;
    return false;
  }
  return sawPunctuation;
}
function isCJKLineStartProhibitedSegment(segment) {
  for (const ch of segment) {
    if (!kinsokuStart.has(ch) && !leftStickyPunctuation.has(ch))
      return false;
  }
  return segment.length > 0;
}
function isForwardStickyClusterSegment(segment) {
  if (isEscapedQuoteClusterSegment(segment))
    return true;
  for (const ch of segment) {
    if (!kinsokuEnd.has(ch) && !forwardStickyGlue.has(ch) && !combiningMarkRe.test(ch))
      return false;
  }
  return segment.length > 0;
}
function isEscapedQuoteClusterSegment(segment) {
  let sawQuote = false;
  for (const ch of segment) {
    if (ch === "\\" || combiningMarkRe.test(ch))
      continue;
    if (kinsokuEnd.has(ch) || leftStickyPunctuation.has(ch) || forwardStickyGlue.has(ch)) {
      sawQuote = true;
      continue;
    }
    return false;
  }
  return sawQuote;
}
function splitTrailingForwardStickyCluster(text) {
  const chars = Array.from(text);
  let splitIndex = chars.length;
  while (splitIndex > 0) {
    const ch = chars[splitIndex - 1];
    if (combiningMarkRe.test(ch)) {
      splitIndex--;
      continue;
    }
    if (kinsokuEnd.has(ch) || forwardStickyGlue.has(ch)) {
      splitIndex--;
      continue;
    }
    break;
  }
  if (splitIndex <= 0 || splitIndex === chars.length)
    return null;
  return {
    head: chars.slice(0, splitIndex).join(""),
    tail: chars.slice(splitIndex).join("")
  };
}
function isRepeatedSingleCharRun(segment, ch) {
  if (segment.length === 0)
    return false;
  for (const part of segment) {
    if (part !== ch)
      return false;
  }
  return true;
}
function endsWithArabicNoSpacePunctuation(segment) {
  if (!containsArabicScript(segment) || segment.length === 0)
    return false;
  return arabicNoSpaceTrailingPunctuation.has(segment[segment.length - 1]);
}
function endsWithMyanmarMedialGlue(segment) {
  if (segment.length === 0)
    return false;
  return myanmarMedialGlue.has(segment[segment.length - 1]);
}
function splitLeadingSpaceAndMarks(segment) {
  if (segment.length < 2 || segment[0] !== " ")
    return null;
  const marks = segment.slice(1);
  if (/^\p{M}+$/u.test(marks)) {
    return { space: " ", marks };
  }
  return null;
}
function endsWithClosingQuote(text) {
  for (let i = text.length - 1;i >= 0; i--) {
    const ch = text[i];
    if (closingQuoteChars.has(ch))
      return true;
    if (!leftStickyPunctuation.has(ch))
      return false;
  }
  return false;
}
function classifySegmentBreakChar(ch, whiteSpaceProfile) {
  if (whiteSpaceProfile.preserveOrdinarySpaces || whiteSpaceProfile.preserveHardBreaks) {
    if (ch === " ")
      return "preserved-space";
    if (ch === "\t")
      return "tab";
    if (whiteSpaceProfile.preserveHardBreaks && ch === `
`)
      return "hard-break";
  }
  if (ch === " ")
    return "space";
  if (ch === " " || ch === " " || ch === "⁠" || ch === "\uFEFF") {
    return "glue";
  }
  if (ch === "​")
    return "zero-width-break";
  if (ch === "­")
    return "soft-hyphen";
  return "text";
}
function splitSegmentByBreakKind(segment, isWordLike, start, whiteSpaceProfile) {
  const pieces = [];
  let currentKind = null;
  let currentText = "";
  let currentStart = start;
  let currentWordLike = false;
  let offset = 0;
  for (const ch of segment) {
    const kind = classifySegmentBreakChar(ch, whiteSpaceProfile);
    const wordLike = kind === "text" && isWordLike;
    if (currentKind !== null && kind === currentKind && wordLike === currentWordLike) {
      currentText += ch;
      offset += ch.length;
      continue;
    }
    if (currentKind !== null) {
      pieces.push({
        text: currentText,
        isWordLike: currentWordLike,
        kind: currentKind,
        start: currentStart
      });
    }
    currentKind = kind;
    currentText = ch;
    currentStart = start + offset;
    currentWordLike = wordLike;
    offset += ch.length;
  }
  if (currentKind !== null) {
    pieces.push({
      text: currentText,
      isWordLike: currentWordLike,
      kind: currentKind,
      start: currentStart
    });
  }
  return pieces;
}
function isTextRunBoundary(kind) {
  return kind === "space" || kind === "preserved-space" || kind === "zero-width-break" || kind === "hard-break";
}
var urlSchemeSegmentRe = /^[A-Za-z][A-Za-z0-9+.-]*:$/;
function isUrlLikeRunStart(segmentation, index) {
  const text = segmentation.texts[index];
  if (text.startsWith("www."))
    return true;
  return urlSchemeSegmentRe.test(text) && index + 1 < segmentation.len && segmentation.kinds[index + 1] === "text" && segmentation.texts[index + 1] === "//";
}
function isUrlQueryBoundarySegment(text) {
  return text.includes("?") && (text.includes("://") || text.startsWith("www."));
}
function mergeUrlLikeRuns(segmentation) {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();
  for (let i = 0;i < segmentation.len; i++) {
    if (kinds[i] !== "text" || !isUrlLikeRunStart(segmentation, i))
      continue;
    let j = i + 1;
    while (j < segmentation.len && !isTextRunBoundary(kinds[j])) {
      texts[i] += texts[j];
      isWordLike[i] = true;
      const endsQueryPrefix = texts[j].includes("?");
      kinds[j] = "text";
      texts[j] = "";
      j++;
      if (endsQueryPrefix)
        break;
    }
  }
  let compactLen = 0;
  for (let read = 0;read < texts.length; read++) {
    const text = texts[read];
    if (text.length === 0)
      continue;
    if (compactLen !== read) {
      texts[compactLen] = text;
      isWordLike[compactLen] = isWordLike[read];
      kinds[compactLen] = kinds[read];
      starts[compactLen] = starts[read];
    }
    compactLen++;
  }
  texts.length = compactLen;
  isWordLike.length = compactLen;
  kinds.length = compactLen;
  starts.length = compactLen;
  return {
    len: compactLen,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeUrlQueryRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0;i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(segmentation.kinds[i]);
    starts.push(segmentation.starts[i]);
    if (!isUrlQueryBoundarySegment(text))
      continue;
    const nextIndex = i + 1;
    if (nextIndex >= segmentation.len || isTextRunBoundary(segmentation.kinds[nextIndex])) {
      continue;
    }
    let queryText = "";
    const queryStart = segmentation.starts[nextIndex];
    let j = nextIndex;
    while (j < segmentation.len && !isTextRunBoundary(segmentation.kinds[j])) {
      queryText += segmentation.texts[j];
      j++;
    }
    if (queryText.length > 0) {
      texts.push(queryText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(queryStart);
      i = j - 1;
    }
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
var numericJoinerChars = new Set([
  ":",
  "-",
  "/",
  "×",
  ",",
  ".",
  "+",
  "–",
  "—"
]);
var asciiPunctuationChainSegmentRe = /^[A-Za-z0-9_]+[,:;]*$/;
var asciiPunctuationChainTrailingJoinersRe = /[,:;]+$/;
function segmentContainsDecimalDigit(text) {
  for (const ch of text) {
    if (decimalDigitRe.test(ch))
      return true;
  }
  return false;
}
function isNumericRunSegment(text) {
  if (text.length === 0)
    return false;
  for (const ch of text) {
    if (decimalDigitRe.test(ch) || numericJoinerChars.has(ch))
      continue;
    return false;
  }
  return true;
}
function mergeNumericRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0;i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    if (kind === "text" && isNumericRunSegment(text) && segmentContainsDecimalDigit(text)) {
      let mergedText = text;
      let j = i + 1;
      while (j < segmentation.len && segmentation.kinds[j] === "text" && isNumericRunSegment(segmentation.texts[j])) {
        mergedText += segmentation.texts[j];
        j++;
      }
      texts.push(mergedText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]);
      i = j - 1;
      continue;
    }
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeAsciiPunctuationChains(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0;i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    const kind = segmentation.kinds[i];
    const wordLike = segmentation.isWordLike[i];
    if (kind === "text" && wordLike && asciiPunctuationChainSegmentRe.test(text)) {
      let mergedText = text;
      let j = i + 1;
      while (asciiPunctuationChainTrailingJoinersRe.test(mergedText) && j < segmentation.len && segmentation.kinds[j] === "text" && segmentation.isWordLike[j] && asciiPunctuationChainSegmentRe.test(segmentation.texts[j])) {
        mergedText += segmentation.texts[j];
        j++;
      }
      texts.push(mergedText);
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]);
      i = j - 1;
      continue;
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function splitHyphenatedNumericRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  for (let i = 0;i < segmentation.len; i++) {
    const text = segmentation.texts[i];
    if (segmentation.kinds[i] === "text" && text.includes("-")) {
      const parts = text.split("-");
      let shouldSplit = parts.length > 1;
      for (let j = 0;j < parts.length; j++) {
        const part = parts[j];
        if (!shouldSplit)
          break;
        if (part.length === 0 || !segmentContainsDecimalDigit(part) || !isNumericRunSegment(part)) {
          shouldSplit = false;
        }
      }
      if (shouldSplit) {
        let offset = 0;
        for (let j = 0;j < parts.length; j++) {
          const part = parts[j];
          const splitText = j < parts.length - 1 ? `${part}-` : part;
          texts.push(splitText);
          isWordLike.push(true);
          kinds.push("text");
          starts.push(segmentation.starts[i] + offset);
          offset += splitText.length;
        }
        continue;
      }
    }
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]);
    kinds.push(segmentation.kinds[i]);
    starts.push(segmentation.starts[i]);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function mergeGlueConnectedTextRuns(segmentation) {
  const texts = [];
  const isWordLike = [];
  const kinds = [];
  const starts = [];
  let read = 0;
  while (read < segmentation.len) {
    let text = segmentation.texts[read];
    let wordLike = segmentation.isWordLike[read];
    let kind = segmentation.kinds[read];
    let start = segmentation.starts[read];
    if (kind === "glue") {
      let glueText = text;
      const glueStart = start;
      read++;
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        glueText += segmentation.texts[read];
        read++;
      }
      if (read < segmentation.len && segmentation.kinds[read] === "text") {
        text = glueText + segmentation.texts[read];
        wordLike = segmentation.isWordLike[read];
        kind = "text";
        start = glueStart;
        read++;
      } else {
        texts.push(glueText);
        isWordLike.push(false);
        kinds.push("glue");
        starts.push(glueStart);
        continue;
      }
    } else {
      read++;
    }
    if (kind === "text") {
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        let glueText = "";
        while (read < segmentation.len && segmentation.kinds[read] === "glue") {
          glueText += segmentation.texts[read];
          read++;
        }
        if (read < segmentation.len && segmentation.kinds[read] === "text") {
          text += glueText + segmentation.texts[read];
          wordLike = wordLike || segmentation.isWordLike[read];
          read++;
          continue;
        }
        text += glueText;
      }
    }
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function carryTrailingForwardStickyAcrossCJKBoundary(segmentation) {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();
  for (let i = 0;i < texts.length - 1; i++) {
    if (kinds[i] !== "text" || kinds[i + 1] !== "text")
      continue;
    if (!isCJK(texts[i]) || !isCJK(texts[i + 1]))
      continue;
    const split = splitTrailingForwardStickyCluster(texts[i]);
    if (split === null)
      continue;
    texts[i] = split.head;
    texts[i + 1] = split.tail + texts[i + 1];
    starts[i + 1] = starts[i] + split.head.length;
  }
  return {
    len: texts.length,
    texts,
    isWordLike,
    kinds,
    starts
  };
}
function buildMergedSegmentation(normalized, profile, whiteSpaceProfile) {
  const wordSegmenter = getSharedWordSegmenter();
  let mergedLen = 0;
  const mergedTexts = [];
  const mergedWordLike = [];
  const mergedKinds = [];
  const mergedStarts = [];
  for (const s of wordSegmenter.segment(normalized)) {
    for (const piece of splitSegmentByBreakKind(s.segment, s.isWordLike ?? false, s.index, whiteSpaceProfile)) {
      const isText = piece.kind === "text";
      if (profile.carryCJKAfterClosingQuote && isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && isCJK(piece.text) && isCJK(mergedTexts[mergedLen - 1]) && endsWithClosingQuote(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && isCJKLineStartProhibitedSegment(piece.text) && isCJK(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && endsWithMyanmarMedialGlue(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = mergedWordLike[mergedLen - 1] || piece.isWordLike;
      } else if (isText && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && piece.isWordLike && containsArabicScript(piece.text) && endsWithArabicNoSpacePunctuation(mergedTexts[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
        mergedWordLike[mergedLen - 1] = true;
      } else if (isText && !piece.isWordLike && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && piece.text.length === 1 && piece.text !== "-" && piece.text !== "—" && isRepeatedSingleCharRun(mergedTexts[mergedLen - 1], piece.text)) {
        mergedTexts[mergedLen - 1] += piece.text;
      } else if (isText && !piece.isWordLike && mergedLen > 0 && mergedKinds[mergedLen - 1] === "text" && (isLeftStickyPunctuationSegment(piece.text) || piece.text === "-" && mergedWordLike[mergedLen - 1])) {
        mergedTexts[mergedLen - 1] += piece.text;
      } else {
        mergedTexts[mergedLen] = piece.text;
        mergedWordLike[mergedLen] = piece.isWordLike;
        mergedKinds[mergedLen] = piece.kind;
        mergedStarts[mergedLen] = piece.start;
        mergedLen++;
      }
    }
  }
  for (let i = 1;i < mergedLen; i++) {
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && isEscapedQuoteClusterSegment(mergedTexts[i]) && mergedKinds[i - 1] === "text") {
      mergedTexts[i - 1] += mergedTexts[i];
      mergedWordLike[i - 1] = mergedWordLike[i - 1] || mergedWordLike[i];
      mergedTexts[i] = "";
    }
  }
  for (let i = mergedLen - 2;i >= 0; i--) {
    if (mergedKinds[i] === "text" && !mergedWordLike[i] && isForwardStickyClusterSegment(mergedTexts[i])) {
      let j = i + 1;
      while (j < mergedLen && mergedTexts[j] === "")
        j++;
      if (j < mergedLen && mergedKinds[j] === "text") {
        mergedTexts[j] = mergedTexts[i] + mergedTexts[j];
        mergedStarts[j] = mergedStarts[i];
        mergedTexts[i] = "";
      }
    }
  }
  let compactLen = 0;
  for (let read = 0;read < mergedLen; read++) {
    const text = mergedTexts[read];
    if (text.length === 0)
      continue;
    if (compactLen !== read) {
      mergedTexts[compactLen] = text;
      mergedWordLike[compactLen] = mergedWordLike[read];
      mergedKinds[compactLen] = mergedKinds[read];
      mergedStarts[compactLen] = mergedStarts[read];
    }
    compactLen++;
  }
  mergedTexts.length = compactLen;
  mergedWordLike.length = compactLen;
  mergedKinds.length = compactLen;
  mergedStarts.length = compactLen;
  const compacted = mergeGlueConnectedTextRuns({
    len: compactLen,
    texts: mergedTexts,
    isWordLike: mergedWordLike,
    kinds: mergedKinds,
    starts: mergedStarts
  });
  const withMergedUrls = carryTrailingForwardStickyAcrossCJKBoundary(mergeAsciiPunctuationChains(splitHyphenatedNumericRuns(mergeNumericRuns(mergeUrlQueryRuns(mergeUrlLikeRuns(compacted))))));
  for (let i = 0;i < withMergedUrls.len - 1; i++) {
    const split = splitLeadingSpaceAndMarks(withMergedUrls.texts[i]);
    if (split === null)
      continue;
    if (withMergedUrls.kinds[i] !== "space" && withMergedUrls.kinds[i] !== "preserved-space" || withMergedUrls.kinds[i + 1] !== "text" || !containsArabicScript(withMergedUrls.texts[i + 1])) {
      continue;
    }
    withMergedUrls.texts[i] = split.space;
    withMergedUrls.isWordLike[i] = false;
    withMergedUrls.kinds[i] = withMergedUrls.kinds[i] === "preserved-space" ? "preserved-space" : "space";
    withMergedUrls.texts[i + 1] = split.marks + withMergedUrls.texts[i + 1];
    withMergedUrls.starts[i + 1] = withMergedUrls.starts[i] + split.space.length;
  }
  return withMergedUrls;
}
function compileAnalysisChunks(segmentation, whiteSpaceProfile) {
  if (segmentation.len === 0)
    return [];
  if (!whiteSpaceProfile.preserveHardBreaks) {
    return [{
      startSegmentIndex: 0,
      endSegmentIndex: segmentation.len,
      consumedEndSegmentIndex: segmentation.len
    }];
  }
  const chunks = [];
  let startSegmentIndex = 0;
  for (let i = 0;i < segmentation.len; i++) {
    if (segmentation.kinds[i] !== "hard-break")
      continue;
    chunks.push({
      startSegmentIndex,
      endSegmentIndex: i,
      consumedEndSegmentIndex: i + 1
    });
    startSegmentIndex = i + 1;
  }
  if (startSegmentIndex < segmentation.len) {
    chunks.push({
      startSegmentIndex,
      endSegmentIndex: segmentation.len,
      consumedEndSegmentIndex: segmentation.len
    });
  }
  return chunks;
}
function analyzeText(text, profile, whiteSpace = "normal") {
  const whiteSpaceProfile = getWhiteSpaceProfile(whiteSpace);
  const normalized = whiteSpaceProfile.mode === "pre-wrap" ? normalizeWhitespacePreWrap(text) : normalizeWhitespaceNormal(text);
  if (normalized.length === 0) {
    return {
      normalized,
      chunks: [],
      len: 0,
      texts: [],
      isWordLike: [],
      kinds: [],
      starts: []
    };
  }
  const segmentation = buildMergedSegmentation(normalized, profile, whiteSpaceProfile);
  return {
    normalized,
    chunks: compileAnalysisChunks(segmentation, whiteSpaceProfile),
    ...segmentation
  };
}

// ../../pretext/src/measurement.ts
var measureContext = null;
var segmentMetricCaches = new Map;
var cachedEngineProfile = null;
var emojiPresentationRe = /\p{Emoji_Presentation}/u;
var maybeEmojiRe = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u;
var sharedGraphemeSegmenter = null;
var emojiCorrectionCache = new Map;
function getMeasureContext() {
  if (measureContext !== null)
    return measureContext;
  if (typeof OffscreenCanvas !== "undefined") {
    measureContext = new OffscreenCanvas(1, 1).getContext("2d");
    return measureContext;
  }
  if (typeof document !== "undefined") {
    measureContext = document.createElement("canvas").getContext("2d");
    return measureContext;
  }
  throw new Error("Text measurement requires OffscreenCanvas or a DOM canvas context.");
}
function getSegmentMetricCache(font) {
  let cache = segmentMetricCaches.get(font);
  if (!cache) {
    cache = new Map;
    segmentMetricCaches.set(font, cache);
  }
  return cache;
}
function getSegmentMetrics(seg, cache) {
  let metrics = cache.get(seg);
  if (metrics === undefined) {
    const ctx = getMeasureContext();
    metrics = {
      width: ctx.measureText(seg).width,
      containsCJK: isCJK(seg)
    };
    cache.set(seg, metrics);
  }
  return metrics;
}
function getEngineProfile() {
  if (cachedEngineProfile !== null)
    return cachedEngineProfile;
  if (typeof navigator === "undefined") {
    cachedEngineProfile = {
      lineFitEpsilon: 0.005,
      carryCJKAfterClosingQuote: false,
      preferPrefixWidthsForBreakableRuns: false,
      preferEarlySoftHyphenBreak: false
    };
    return cachedEngineProfile;
  }
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;
  const isSafari = vendor === "Apple Computer, Inc." && ua.includes("Safari/") && !ua.includes("Chrome/") && !ua.includes("Chromium/") && !ua.includes("CriOS/") && !ua.includes("FxiOS/") && !ua.includes("EdgiOS/");
  const isChromium = ua.includes("Chrome/") || ua.includes("Chromium/") || ua.includes("CriOS/") || ua.includes("Edg/");
  cachedEngineProfile = {
    lineFitEpsilon: isSafari ? 1 / 64 : 0.005,
    carryCJKAfterClosingQuote: isChromium,
    preferPrefixWidthsForBreakableRuns: isSafari,
    preferEarlySoftHyphenBreak: isSafari
  };
  return cachedEngineProfile;
}
function parseFontSize(font) {
  const m = font.match(/(\d+(?:\.\d+)?)\s*px/);
  return m ? parseFloat(m[1]) : 16;
}
function getSharedGraphemeSegmenter() {
  if (sharedGraphemeSegmenter === null) {
    sharedGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter;
}
function isEmojiGrapheme(g) {
  return emojiPresentationRe.test(g) || g.includes("️");
}
function textMayContainEmoji(text) {
  return maybeEmojiRe.test(text);
}
function getEmojiCorrection(font, fontSize) {
  let correction = emojiCorrectionCache.get(font);
  if (correction !== undefined)
    return correction;
  const ctx = getMeasureContext();
  ctx.font = font;
  const canvasW = ctx.measureText("\uD83D\uDE00").width;
  correction = 0;
  if (canvasW > fontSize + 0.5 && typeof document !== "undefined" && document.body !== null) {
    const span = document.createElement("span");
    span.style.font = font;
    span.style.display = "inline-block";
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.textContent = "\uD83D\uDE00";
    document.body.appendChild(span);
    const domW = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    if (canvasW - domW > 0.5) {
      correction = canvasW - domW;
    }
  }
  emojiCorrectionCache.set(font, correction);
  return correction;
}
function countEmojiGraphemes(text) {
  let count = 0;
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const g of graphemeSegmenter.segment(text)) {
    if (isEmojiGrapheme(g.segment))
      count++;
  }
  return count;
}
function getEmojiCount(seg, metrics) {
  if (metrics.emojiCount === undefined) {
    metrics.emojiCount = countEmojiGraphemes(seg);
  }
  return metrics.emojiCount;
}
function getCorrectedSegmentWidth(seg, metrics, emojiCorrection) {
  if (emojiCorrection === 0)
    return metrics.width;
  return metrics.width - getEmojiCount(seg, metrics) * emojiCorrection;
}
function getSegmentGraphemeWidths(seg, metrics, cache, emojiCorrection) {
  if (metrics.graphemeWidths !== undefined)
    return metrics.graphemeWidths;
  const widths = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  for (const gs of graphemeSegmenter.segment(seg)) {
    const graphemeMetrics = getSegmentMetrics(gs.segment, cache);
    widths.push(getCorrectedSegmentWidth(gs.segment, graphemeMetrics, emojiCorrection));
  }
  metrics.graphemeWidths = widths.length > 1 ? widths : null;
  return metrics.graphemeWidths;
}
function getSegmentGraphemePrefixWidths(seg, metrics, cache, emojiCorrection) {
  if (metrics.graphemePrefixWidths !== undefined)
    return metrics.graphemePrefixWidths;
  const prefixWidths = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter();
  let prefix = "";
  for (const gs of graphemeSegmenter.segment(seg)) {
    prefix += gs.segment;
    const prefixMetrics = getSegmentMetrics(prefix, cache);
    prefixWidths.push(getCorrectedSegmentWidth(prefix, prefixMetrics, emojiCorrection));
  }
  metrics.graphemePrefixWidths = prefixWidths.length > 1 ? prefixWidths : null;
  return metrics.graphemePrefixWidths;
}
function getFontMeasurementState(font, needsEmojiCorrection) {
  const ctx = getMeasureContext();
  ctx.font = font;
  const cache = getSegmentMetricCache(font);
  const fontSize = parseFontSize(font);
  const emojiCorrection = needsEmojiCorrection ? getEmojiCorrection(font, fontSize) : 0;
  return { cache, fontSize, emojiCorrection };
}

// ../../pretext/src/line-break.ts
function canBreakAfter(kind) {
  return kind === "space" || kind === "preserved-space" || kind === "tab" || kind === "zero-width-break" || kind === "soft-hyphen";
}
function getTabAdvance(lineWidth, tabStopAdvance) {
  if (tabStopAdvance <= 0)
    return 0;
  const remainder = lineWidth % tabStopAdvance;
  if (Math.abs(remainder) <= 0.000001)
    return tabStopAdvance;
  return tabStopAdvance - remainder;
}
function getBreakableAdvance(graphemeWidths, graphemePrefixWidths, graphemeIndex, preferPrefixWidths) {
  if (!preferPrefixWidths || graphemePrefixWidths === null) {
    return graphemeWidths[graphemeIndex];
  }
  return graphemePrefixWidths[graphemeIndex] - (graphemeIndex > 0 ? graphemePrefixWidths[graphemeIndex - 1] : 0);
}
function fitSoftHyphenBreak(graphemeWidths, initialWidth, maxWidth, lineFitEpsilon, discretionaryHyphenWidth, cumulativeWidths) {
  let fitCount = 0;
  let fittedWidth = initialWidth;
  while (fitCount < graphemeWidths.length) {
    const nextWidth = cumulativeWidths ? initialWidth + graphemeWidths[fitCount] : fittedWidth + graphemeWidths[fitCount];
    const nextLineWidth = fitCount + 1 < graphemeWidths.length ? nextWidth + discretionaryHyphenWidth : nextWidth;
    if (nextLineWidth > maxWidth + lineFitEpsilon)
      break;
    fittedWidth = nextWidth;
    fitCount++;
  }
  return { fitCount, fittedWidth };
}
function findChunkIndexForStart(prepared, segmentIndex) {
  for (let i = 0;i < prepared.chunks.length; i++) {
    const chunk = prepared.chunks[i];
    if (segmentIndex < chunk.consumedEndSegmentIndex)
      return i;
  }
  return -1;
}
function normalizeLineStart(prepared, start) {
  let segmentIndex = start.segmentIndex;
  const graphemeIndex = start.graphemeIndex;
  if (segmentIndex >= prepared.widths.length)
    return null;
  if (graphemeIndex > 0)
    return start;
  const chunkIndex = findChunkIndexForStart(prepared, segmentIndex);
  if (chunkIndex < 0)
    return null;
  const chunk = prepared.chunks[chunkIndex];
  if (chunk.startSegmentIndex === chunk.endSegmentIndex && segmentIndex === chunk.startSegmentIndex) {
    return { segmentIndex, graphemeIndex: 0 };
  }
  if (segmentIndex < chunk.startSegmentIndex)
    segmentIndex = chunk.startSegmentIndex;
  while (segmentIndex < chunk.endSegmentIndex) {
    const kind = prepared.kinds[segmentIndex];
    if (kind !== "space" && kind !== "zero-width-break" && kind !== "soft-hyphen") {
      return { segmentIndex, graphemeIndex: 0 };
    }
    segmentIndex++;
  }
  if (chunk.consumedEndSegmentIndex >= prepared.widths.length)
    return null;
  return { segmentIndex: chunk.consumedEndSegmentIndex, graphemeIndex: 0 };
}
function layoutNextLineRange(prepared, start, maxWidth) {
  const normalizedStart = normalizeLineStart(prepared, start);
  if (normalizedStart === null)
    return null;
  if (prepared.simpleLineWalkFastPath) {
    return layoutNextLineRangeSimple(prepared, normalizedStart, maxWidth);
  }
  const chunkIndex = findChunkIndexForStart(prepared, normalizedStart.segmentIndex);
  if (chunkIndex < 0)
    return null;
  const chunk = prepared.chunks[chunkIndex];
  if (chunk.startSegmentIndex === chunk.endSegmentIndex) {
    return {
      startSegmentIndex: chunk.startSegmentIndex,
      startGraphemeIndex: 0,
      endSegmentIndex: chunk.consumedEndSegmentIndex,
      endGraphemeIndex: 0,
      width: 0
    };
  }
  const {
    widths,
    lineEndFitAdvances,
    lineEndPaintAdvances,
    kinds,
    breakableWidths,
    breakablePrefixWidths,
    discretionaryHyphenWidth,
    tabStopAdvance
  } = prepared;
  const engineProfile = getEngineProfile();
  const lineFitEpsilon = engineProfile.lineFitEpsilon;
  let lineW = 0;
  let hasContent = false;
  const lineStartSegmentIndex = normalizedStart.segmentIndex;
  const lineStartGraphemeIndex = normalizedStart.graphemeIndex;
  let lineEndSegmentIndex = lineStartSegmentIndex;
  let lineEndGraphemeIndex = lineStartGraphemeIndex;
  let pendingBreakSegmentIndex = -1;
  let pendingBreakFitWidth = 0;
  let pendingBreakPaintWidth = 0;
  let pendingBreakKind = null;
  function clearPendingBreak() {
    pendingBreakSegmentIndex = -1;
    pendingBreakFitWidth = 0;
    pendingBreakPaintWidth = 0;
    pendingBreakKind = null;
  }
  function finishLine(endSegmentIndex = lineEndSegmentIndex, endGraphemeIndex = lineEndGraphemeIndex, width = lineW) {
    if (!hasContent)
      return null;
    return {
      startSegmentIndex: lineStartSegmentIndex,
      startGraphemeIndex: lineStartGraphemeIndex,
      endSegmentIndex,
      endGraphemeIndex,
      width
    };
  }
  function startLineAtSegment(segmentIndex, width) {
    hasContent = true;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
    lineW = width;
  }
  function startLineAtGrapheme(segmentIndex, graphemeIndex, width) {
    hasContent = true;
    lineEndSegmentIndex = segmentIndex;
    lineEndGraphemeIndex = graphemeIndex + 1;
    lineW = width;
  }
  function appendWholeSegment(segmentIndex, width) {
    if (!hasContent) {
      startLineAtSegment(segmentIndex, width);
      return;
    }
    lineW += width;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
  }
  function updatePendingBreakForWholeSegment(segmentIndex, segmentWidth) {
    if (!canBreakAfter(kinds[segmentIndex]))
      return;
    const fitAdvance = kinds[segmentIndex] === "tab" ? 0 : lineEndFitAdvances[segmentIndex];
    const paintAdvance = kinds[segmentIndex] === "tab" ? segmentWidth : lineEndPaintAdvances[segmentIndex];
    pendingBreakSegmentIndex = segmentIndex + 1;
    pendingBreakFitWidth = lineW - segmentWidth + fitAdvance;
    pendingBreakPaintWidth = lineW - segmentWidth + paintAdvance;
    pendingBreakKind = kinds[segmentIndex];
  }
  function appendBreakableSegmentFrom(segmentIndex, startGraphemeIndex) {
    const gWidths = breakableWidths[segmentIndex];
    const gPrefixWidths = breakablePrefixWidths[segmentIndex] ?? null;
    for (let g = startGraphemeIndex;g < gWidths.length; g++) {
      const gw = getBreakableAdvance(gWidths, gPrefixWidths, g, engineProfile.preferPrefixWidthsForBreakableRuns);
      if (!hasContent) {
        startLineAtGrapheme(segmentIndex, g, gw);
        continue;
      }
      if (lineW + gw > maxWidth + lineFitEpsilon) {
        return finishLine();
      }
      lineW += gw;
      lineEndSegmentIndex = segmentIndex;
      lineEndGraphemeIndex = g + 1;
    }
    if (hasContent && lineEndSegmentIndex === segmentIndex && lineEndGraphemeIndex === gWidths.length) {
      lineEndSegmentIndex = segmentIndex + 1;
      lineEndGraphemeIndex = 0;
    }
    return null;
  }
  function maybeFinishAtSoftHyphen(segmentIndex) {
    if (pendingBreakKind !== "soft-hyphen" || pendingBreakSegmentIndex < 0)
      return null;
    const gWidths = breakableWidths[segmentIndex] ?? null;
    if (gWidths !== null) {
      const fitWidths = engineProfile.preferPrefixWidthsForBreakableRuns ? breakablePrefixWidths[segmentIndex] ?? gWidths : gWidths;
      const usesPrefixWidths = fitWidths !== gWidths;
      const { fitCount, fittedWidth } = fitSoftHyphenBreak(fitWidths, lineW, maxWidth, lineFitEpsilon, discretionaryHyphenWidth, usesPrefixWidths);
      if (fitCount === gWidths.length) {
        lineW = fittedWidth;
        lineEndSegmentIndex = segmentIndex + 1;
        lineEndGraphemeIndex = 0;
        clearPendingBreak();
        return null;
      }
      if (fitCount > 0) {
        return finishLine(segmentIndex, fitCount, fittedWidth + discretionaryHyphenWidth);
      }
    }
    if (pendingBreakFitWidth <= maxWidth + lineFitEpsilon) {
      return finishLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
    }
    return null;
  }
  for (let i = normalizedStart.segmentIndex;i < chunk.endSegmentIndex; i++) {
    const kind = kinds[i];
    const startGraphemeIndex = i === normalizedStart.segmentIndex ? normalizedStart.graphemeIndex : 0;
    const w = kind === "tab" ? getTabAdvance(lineW, tabStopAdvance) : widths[i];
    if (kind === "soft-hyphen" && startGraphemeIndex === 0) {
      if (hasContent) {
        lineEndSegmentIndex = i + 1;
        lineEndGraphemeIndex = 0;
        pendingBreakSegmentIndex = i + 1;
        pendingBreakFitWidth = lineW + discretionaryHyphenWidth;
        pendingBreakPaintWidth = lineW + discretionaryHyphenWidth;
        pendingBreakKind = kind;
      }
      continue;
    }
    if (!hasContent) {
      if (startGraphemeIndex > 0) {
        const line = appendBreakableSegmentFrom(i, startGraphemeIndex);
        if (line !== null)
          return line;
      } else if (w > maxWidth && breakableWidths[i] !== null) {
        const line = appendBreakableSegmentFrom(i, 0);
        if (line !== null)
          return line;
      } else {
        startLineAtSegment(i, w);
      }
      updatePendingBreakForWholeSegment(i, w);
      continue;
    }
    const newW = lineW + w;
    if (newW > maxWidth + lineFitEpsilon) {
      const currentBreakFitWidth = lineW + (kind === "tab" ? 0 : lineEndFitAdvances[i]);
      const currentBreakPaintWidth = lineW + (kind === "tab" ? w : lineEndPaintAdvances[i]);
      if (pendingBreakKind === "soft-hyphen" && engineProfile.preferEarlySoftHyphenBreak && pendingBreakFitWidth <= maxWidth + lineFitEpsilon) {
        return finishLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
      }
      const softBreakLine = maybeFinishAtSoftHyphen(i);
      if (softBreakLine !== null)
        return softBreakLine;
      if (canBreakAfter(kind) && currentBreakFitWidth <= maxWidth + lineFitEpsilon) {
        appendWholeSegment(i, w);
        return finishLine(i + 1, 0, currentBreakPaintWidth);
      }
      if (pendingBreakSegmentIndex >= 0 && pendingBreakFitWidth <= maxWidth + lineFitEpsilon) {
        return finishLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
      }
      if (w > maxWidth && breakableWidths[i] !== null) {
        const currentLine = finishLine();
        if (currentLine !== null)
          return currentLine;
        const line = appendBreakableSegmentFrom(i, 0);
        if (line !== null)
          return line;
      }
      return finishLine();
    }
    appendWholeSegment(i, w);
    updatePendingBreakForWholeSegment(i, w);
  }
  if (pendingBreakSegmentIndex === chunk.consumedEndSegmentIndex && lineEndGraphemeIndex === 0) {
    return finishLine(chunk.consumedEndSegmentIndex, 0, pendingBreakPaintWidth);
  }
  return finishLine(chunk.consumedEndSegmentIndex, 0, lineW);
}
function layoutNextLineRangeSimple(prepared, normalizedStart, maxWidth) {
  const { widths, kinds, breakableWidths, breakablePrefixWidths } = prepared;
  const engineProfile = getEngineProfile();
  const lineFitEpsilon = engineProfile.lineFitEpsilon;
  let lineW = 0;
  let hasContent = false;
  const lineStartSegmentIndex = normalizedStart.segmentIndex;
  const lineStartGraphemeIndex = normalizedStart.graphemeIndex;
  let lineEndSegmentIndex = lineStartSegmentIndex;
  let lineEndGraphemeIndex = lineStartGraphemeIndex;
  let pendingBreakSegmentIndex = -1;
  let pendingBreakPaintWidth = 0;
  function finishLine(endSegmentIndex = lineEndSegmentIndex, endGraphemeIndex = lineEndGraphemeIndex, width = lineW) {
    if (!hasContent)
      return null;
    return {
      startSegmentIndex: lineStartSegmentIndex,
      startGraphemeIndex: lineStartGraphemeIndex,
      endSegmentIndex,
      endGraphemeIndex,
      width
    };
  }
  function startLineAtSegment(segmentIndex, width) {
    hasContent = true;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
    lineW = width;
  }
  function startLineAtGrapheme(segmentIndex, graphemeIndex, width) {
    hasContent = true;
    lineEndSegmentIndex = segmentIndex;
    lineEndGraphemeIndex = graphemeIndex + 1;
    lineW = width;
  }
  function appendWholeSegment(segmentIndex, width) {
    if (!hasContent) {
      startLineAtSegment(segmentIndex, width);
      return;
    }
    lineW += width;
    lineEndSegmentIndex = segmentIndex + 1;
    lineEndGraphemeIndex = 0;
  }
  function updatePendingBreak(segmentIndex, segmentWidth) {
    if (!canBreakAfter(kinds[segmentIndex]))
      return;
    pendingBreakSegmentIndex = segmentIndex + 1;
    pendingBreakPaintWidth = lineW - segmentWidth;
  }
  function appendBreakableSegmentFrom(segmentIndex, startGraphemeIndex) {
    const gWidths = breakableWidths[segmentIndex];
    const gPrefixWidths = breakablePrefixWidths[segmentIndex] ?? null;
    for (let g = startGraphemeIndex;g < gWidths.length; g++) {
      const gw = getBreakableAdvance(gWidths, gPrefixWidths, g, engineProfile.preferPrefixWidthsForBreakableRuns);
      if (!hasContent) {
        startLineAtGrapheme(segmentIndex, g, gw);
        continue;
      }
      if (lineW + gw > maxWidth + lineFitEpsilon) {
        return finishLine();
      }
      lineW += gw;
      lineEndSegmentIndex = segmentIndex;
      lineEndGraphemeIndex = g + 1;
    }
    if (hasContent && lineEndSegmentIndex === segmentIndex && lineEndGraphemeIndex === gWidths.length) {
      lineEndSegmentIndex = segmentIndex + 1;
      lineEndGraphemeIndex = 0;
    }
    return null;
  }
  for (let i = normalizedStart.segmentIndex;i < widths.length; i++) {
    const w = widths[i];
    const kind = kinds[i];
    const startGraphemeIndex = i === normalizedStart.segmentIndex ? normalizedStart.graphemeIndex : 0;
    if (!hasContent) {
      if (startGraphemeIndex > 0) {
        const line = appendBreakableSegmentFrom(i, startGraphemeIndex);
        if (line !== null)
          return line;
      } else if (w > maxWidth && breakableWidths[i] !== null) {
        const line = appendBreakableSegmentFrom(i, 0);
        if (line !== null)
          return line;
      } else {
        startLineAtSegment(i, w);
      }
      updatePendingBreak(i, w);
      continue;
    }
    const newW = lineW + w;
    if (newW > maxWidth + lineFitEpsilon) {
      if (canBreakAfter(kind)) {
        appendWholeSegment(i, w);
        return finishLine(i + 1, 0, lineW - w);
      }
      if (pendingBreakSegmentIndex >= 0) {
        return finishLine(pendingBreakSegmentIndex, 0, pendingBreakPaintWidth);
      }
      if (w > maxWidth && breakableWidths[i] !== null) {
        const currentLine = finishLine();
        if (currentLine !== null)
          return currentLine;
        const line = appendBreakableSegmentFrom(i, 0);
        if (line !== null)
          return line;
      }
      return finishLine();
    }
    appendWholeSegment(i, w);
    updatePendingBreak(i, w);
  }
  return finishLine();
}

// ../../pretext/src/layout.ts
var sharedGraphemeSegmenter2 = null;
var sharedLineTextCaches = new WeakMap;
function getSharedGraphemeSegmenter2() {
  if (sharedGraphemeSegmenter2 === null) {
    sharedGraphemeSegmenter2 = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter2;
}
function createEmptyPrepared(includeSegments) {
  if (includeSegments) {
    return {
      widths: [],
      lineEndFitAdvances: [],
      lineEndPaintAdvances: [],
      kinds: [],
      simpleLineWalkFastPath: true,
      segLevels: null,
      breakableWidths: [],
      breakablePrefixWidths: [],
      discretionaryHyphenWidth: 0,
      tabStopAdvance: 0,
      chunks: [],
      segments: []
    };
  }
  return {
    widths: [],
    lineEndFitAdvances: [],
    lineEndPaintAdvances: [],
    kinds: [],
    simpleLineWalkFastPath: true,
    segLevels: null,
    breakableWidths: [],
    breakablePrefixWidths: [],
    discretionaryHyphenWidth: 0,
    tabStopAdvance: 0,
    chunks: []
  };
}
function measureAnalysis(analysis, font, includeSegments) {
  const graphemeSegmenter = getSharedGraphemeSegmenter2();
  const engineProfile = getEngineProfile();
  const { cache, emojiCorrection } = getFontMeasurementState(font, textMayContainEmoji(analysis.normalized));
  const discretionaryHyphenWidth = getCorrectedSegmentWidth("-", getSegmentMetrics("-", cache), emojiCorrection);
  const spaceWidth = getCorrectedSegmentWidth(" ", getSegmentMetrics(" ", cache), emojiCorrection);
  const tabStopAdvance = spaceWidth * 8;
  if (analysis.len === 0)
    return createEmptyPrepared(includeSegments);
  const widths = [];
  const lineEndFitAdvances = [];
  const lineEndPaintAdvances = [];
  const kinds = [];
  let simpleLineWalkFastPath = analysis.chunks.length <= 1;
  const segStarts = includeSegments ? [] : null;
  const breakableWidths = [];
  const breakablePrefixWidths = [];
  const segments = includeSegments ? [] : null;
  const preparedStartByAnalysisIndex = Array.from({ length: analysis.len });
  const preparedEndByAnalysisIndex = Array.from({ length: analysis.len });
  function pushMeasuredSegment(text, width, lineEndFitAdvance, lineEndPaintAdvance, kind, start, breakable, breakablePrefix) {
    if (kind !== "text" && kind !== "space" && kind !== "zero-width-break") {
      simpleLineWalkFastPath = false;
    }
    widths.push(width);
    lineEndFitAdvances.push(lineEndFitAdvance);
    lineEndPaintAdvances.push(lineEndPaintAdvance);
    kinds.push(kind);
    segStarts?.push(start);
    breakableWidths.push(breakable);
    breakablePrefixWidths.push(breakablePrefix);
    if (segments !== null)
      segments.push(text);
  }
  for (let mi = 0;mi < analysis.len; mi++) {
    preparedStartByAnalysisIndex[mi] = widths.length;
    const segText = analysis.texts[mi];
    const segWordLike = analysis.isWordLike[mi];
    const segKind = analysis.kinds[mi];
    const segStart = analysis.starts[mi];
    if (segKind === "soft-hyphen") {
      pushMeasuredSegment(segText, 0, discretionaryHyphenWidth, discretionaryHyphenWidth, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    if (segKind === "hard-break") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    if (segKind === "tab") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null, null);
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    const segMetrics = getSegmentMetrics(segText, cache);
    if (segKind === "text" && segMetrics.containsCJK) {
      let unitText = "";
      let unitStart = 0;
      for (const gs of graphemeSegmenter.segment(segText)) {
        const grapheme = gs.segment;
        if (unitText.length === 0) {
          unitText = grapheme;
          unitStart = gs.index;
          continue;
        }
        if (kinsokuEnd.has(unitText) || kinsokuStart.has(grapheme) || leftStickyPunctuation.has(grapheme) || engineProfile.carryCJKAfterClosingQuote && isCJK(grapheme) && endsWithClosingQuote(unitText)) {
          unitText += grapheme;
          continue;
        }
        const unitMetrics = getSegmentMetrics(unitText, cache);
        const w2 = getCorrectedSegmentWidth(unitText, unitMetrics, emojiCorrection);
        pushMeasuredSegment(unitText, w2, w2, w2, "text", segStart + unitStart, null, null);
        unitText = grapheme;
        unitStart = gs.index;
      }
      if (unitText.length > 0) {
        const unitMetrics = getSegmentMetrics(unitText, cache);
        const w2 = getCorrectedSegmentWidth(unitText, unitMetrics, emojiCorrection);
        pushMeasuredSegment(unitText, w2, w2, w2, "text", segStart + unitStart, null, null);
      }
      preparedEndByAnalysisIndex[mi] = widths.length;
      continue;
    }
    const w = getCorrectedSegmentWidth(segText, segMetrics, emojiCorrection);
    const lineEndFitAdvance = segKind === "space" || segKind === "preserved-space" || segKind === "zero-width-break" ? 0 : w;
    const lineEndPaintAdvance = segKind === "space" || segKind === "zero-width-break" ? 0 : w;
    if (segWordLike && segText.length > 1) {
      const graphemeWidths = getSegmentGraphemeWidths(segText, segMetrics, cache, emojiCorrection);
      const graphemePrefixWidths = engineProfile.preferPrefixWidthsForBreakableRuns ? getSegmentGraphemePrefixWidths(segText, segMetrics, cache, emojiCorrection) : null;
      pushMeasuredSegment(segText, w, lineEndFitAdvance, lineEndPaintAdvance, segKind, segStart, graphemeWidths, graphemePrefixWidths);
    } else {
      pushMeasuredSegment(segText, w, lineEndFitAdvance, lineEndPaintAdvance, segKind, segStart, null, null);
    }
    preparedEndByAnalysisIndex[mi] = widths.length;
  }
  const chunks = mapAnalysisChunksToPreparedChunks(analysis.chunks, preparedStartByAnalysisIndex, preparedEndByAnalysisIndex);
  const segLevels = segStarts === null ? null : computeSegmentLevels(analysis.normalized, segStarts);
  if (segments !== null) {
    return {
      widths,
      lineEndFitAdvances,
      lineEndPaintAdvances,
      kinds,
      simpleLineWalkFastPath,
      segLevels,
      breakableWidths,
      breakablePrefixWidths,
      discretionaryHyphenWidth,
      tabStopAdvance,
      chunks,
      segments
    };
  }
  return {
    widths,
    lineEndFitAdvances,
    lineEndPaintAdvances,
    kinds,
    simpleLineWalkFastPath,
    segLevels,
    breakableWidths,
    breakablePrefixWidths,
    discretionaryHyphenWidth,
    tabStopAdvance,
    chunks
  };
}
function mapAnalysisChunksToPreparedChunks(chunks, preparedStartByAnalysisIndex, preparedEndByAnalysisIndex) {
  const preparedChunks = [];
  for (let i = 0;i < chunks.length; i++) {
    const chunk = chunks[i];
    const startSegmentIndex = chunk.startSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.startSegmentIndex] : preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1] ?? 0;
    const endSegmentIndex = chunk.endSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.endSegmentIndex] : preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1] ?? 0;
    const consumedEndSegmentIndex = chunk.consumedEndSegmentIndex < preparedStartByAnalysisIndex.length ? preparedStartByAnalysisIndex[chunk.consumedEndSegmentIndex] : preparedEndByAnalysisIndex[preparedEndByAnalysisIndex.length - 1] ?? 0;
    preparedChunks.push({
      startSegmentIndex,
      endSegmentIndex,
      consumedEndSegmentIndex
    });
  }
  return preparedChunks;
}
function prepareInternal(text, font, includeSegments, options) {
  const analysis = analyzeText(text, getEngineProfile(), options?.whiteSpace);
  return measureAnalysis(analysis, font, includeSegments);
}
function prepareWithSegments(text, font, options) {
  return prepareInternal(text, font, true, options);
}
function getSegmentGraphemes(segmentIndex, segments, cache) {
  let graphemes = cache.get(segmentIndex);
  if (graphemes !== undefined)
    return graphemes;
  graphemes = [];
  const graphemeSegmenter = getSharedGraphemeSegmenter2();
  for (const gs of graphemeSegmenter.segment(segments[segmentIndex])) {
    graphemes.push(gs.segment);
  }
  cache.set(segmentIndex, graphemes);
  return graphemes;
}
function getLineTextCache(prepared) {
  let cache = sharedLineTextCaches.get(prepared);
  if (cache !== undefined)
    return cache;
  cache = new Map;
  sharedLineTextCaches.set(prepared, cache);
  return cache;
}
function lineHasDiscretionaryHyphen(kinds, startSegmentIndex, startGraphemeIndex, endSegmentIndex) {
  return endSegmentIndex > 0 && kinds[endSegmentIndex - 1] === "soft-hyphen" && !(startSegmentIndex === endSegmentIndex && startGraphemeIndex > 0);
}
function buildLineTextFromRange(segments, kinds, cache, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  let text = "";
  const endsWithDiscretionaryHyphen = lineHasDiscretionaryHyphen(kinds, startSegmentIndex, startGraphemeIndex, endSegmentIndex);
  for (let i = startSegmentIndex;i < endSegmentIndex; i++) {
    if (kinds[i] === "soft-hyphen" || kinds[i] === "hard-break")
      continue;
    if (i === startSegmentIndex && startGraphemeIndex > 0) {
      text += getSegmentGraphemes(i, segments, cache).slice(startGraphemeIndex).join("");
    } else {
      text += segments[i];
    }
  }
  if (endGraphemeIndex > 0) {
    if (endsWithDiscretionaryHyphen)
      text += "-";
    text += getSegmentGraphemes(endSegmentIndex, segments, cache).slice(startSegmentIndex === endSegmentIndex ? startGraphemeIndex : 0, endGraphemeIndex).join("");
  } else if (endsWithDiscretionaryHyphen) {
    text += "-";
  }
  return text;
}
function createLayoutLine(prepared, cache, width, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex) {
  return {
    text: buildLineTextFromRange(prepared.segments, prepared.kinds, cache, startSegmentIndex, startGraphemeIndex, endSegmentIndex, endGraphemeIndex),
    width,
    start: {
      segmentIndex: startSegmentIndex,
      graphemeIndex: startGraphemeIndex
    },
    end: {
      segmentIndex: endSegmentIndex,
      graphemeIndex: endGraphemeIndex
    }
  };
}
function toLayoutLineRange(line) {
  return {
    width: line.width,
    start: {
      segmentIndex: line.startSegmentIndex,
      graphemeIndex: line.startGraphemeIndex
    },
    end: {
      segmentIndex: line.endSegmentIndex,
      graphemeIndex: line.endGraphemeIndex
    }
  };
}
function stepLineRange(prepared, start, maxWidth) {
  const line = layoutNextLineRange(prepared, start, maxWidth);
  if (line === null)
    return null;
  return toLayoutLineRange(line);
}
function materializeLine(prepared, line) {
  return createLayoutLine(prepared, getLineTextCache(prepared), line.width, line.start.segmentIndex, line.start.graphemeIndex, line.end.segmentIndex, line.end.graphemeIndex);
}
function layoutNextLine(prepared, start, maxWidth) {
  const line = stepLineRange(prepared, start, maxWidth);
  if (line === null)
    return null;
  return materializeLine(prepared, line);
}

// app.ts
var PARAGRAPHS = [
  `This space is designed to help you move from scattered thoughts to clear direction. Whether you're exploring an idea, organizing your workflow, or refining details, everything stays flexible and easy to adjust. You can start simple, iterate quickly, and build structure over time without losing momentum. It's not about perfection—it's about making progress visible. Most ideas don't start fully formed. They begin as fragments—notes, sketches, questions. This space gives those fragments room to grow.`,
  `As you work, patterns start to emerge, decisions become clearer, and what once felt messy turns into something intentional. The goal isn't to force structure too early, but to let it happen naturally through iteration. Everything here is built to support clarity and flow. Information is organized in a way that helps you quickly understand what's happening, what needs attention, and what comes next. You can move between different states—exploring, editing, finalizing—without friction. The system adapts as your needs change, so you're never locked into a single way of working.`,
  `Sometimes the hardest part is simply starting. Once you begin, things shift. Ideas connect, directions form, and small steps add up. This space is meant to support that process quietly in the background—giving you just enough structure to stay grounded, while leaving room for exploration and change. Design is rarely a straight line. It moves between uncertainty and clarity, exploration and decision. This environment is built to support that rhythm—helping you navigate complexity, test ideas quickly, and shape outcomes with intention. Over time, what starts as ambiguity becomes something structured, thoughtful, and real.`,
  `Good tools stay out of the way. They don't demand attention or force you into rigid workflows. Instead, they respond to how you think—adapting quietly as your focus shifts. The best interfaces feel almost invisible, letting you concentrate on the work itself rather than the mechanics of doing it. When a tool works well, you forget it's there.`,
  `Every project carries its own rhythm. Some move fast, driven by urgency and tight deadlines. Others unfold slowly, shaped by reflection and careful revision. The key is recognizing which pace serves the work best and trusting the process even when progress feels slow. Momentum isn't always visible, but it's always building beneath the surface.`
];
var mode = "desktop";
var FONT = '16px "Source Code Pro", monospace';
var LINE_HEIGHT = 24;
var PADDING = 16;
var TEXT_COLOR = "rgba(255, 255, 255, 0.82)";
var BAR_HEIGHT = 56;
var TOP_BAR_HEIGHT = 44;
var FINGER_RADIUS = 40;
var PARA_GAP = 16;
var DESK_FONT = '15px "Source Serif 4", Georgia, serif';
var DESK_LINE_HEIGHT = 24;
var DESK_PAD = 48;
var DESK_PARA_GAP = 18;
var DESK_TEXT_COLOR = "rgba(255, 255, 255, 0.75)";
var DESK_COL_GAP = 40;
var DESK_TITLE_FONT = '72px "Playfair Display", Georgia, serif';
var DESK_TITLE_LH = 78;
var DESK_SUB_FONT = 'italic 20px "Playfair Display", Georgia, serif';
var QUOTE_TEXT = "Simplicity is about subtracting the obvious and adding the meaningful.";
var QUOTE_FONT = 'bold 24px "Playfair Display", Georgia, serif';
var preparedQuote = null;
var preparedTitle = null;
var preparedSub = null;
var TITLE_TEXT = "Text Play";
var SUB_TEXT = "An interactive typography experiment";
var autoImgEl = null;
var autoImgX = 0;
var autoImgY = 0;
var autoImgW = 150;
var autoImgH = 150;
var autoImgVx = 1.5;
var autoImgVy = 1;
var autoImgActive = false;
var autoImgAlphaEdges = null;
var QUOTE_W = 260;
var QUOTE_H = 220;
var quoteX = 0;
var quoteY = 0;
var quoteDragging = false;
var quoteDragOffX = 0;
var quoteDragOffY = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var W = 0;
var H = 0;
var preparedParas = [];
var preparedDesk = [];
var pointer = null;
var desktopMouse = null;
var strokes = [];
var currentStroke = null;
var PATH_RADIUS = 18;
var SHAPES = ["original", "circle", "square"];
var placedImages = [];
function getFingerIntervalsForBand(bandTop, bandBottom) {
  if (!pointer)
    return [];
  const r = FINGER_RADIUS;
  if (bandBottom < pointer.y - r || bandTop > pointer.y + r)
    return [];
  let maxDx = 0;
  for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
    const dy = sy - pointer.y;
    const dxSq = r * r - dy * dy;
    if (dxSq > 0) {
      const dx = Math.sqrt(dxSq);
      if (dx > maxDx)
        maxDx = dx;
    }
  }
  if (maxDx <= 0)
    return [];
  return [{ left: pointer.x - maxDx, right: pointer.x + maxDx }];
}
function getStrokeIntervalsForBand(bandTop, bandBottom) {
  const intervals = [];
  const r = PATH_RADIUS;
  const allStrokes = currentStroke ? strokes.concat([currentStroke]) : strokes;
  for (let si = 0;si < allStrokes.length; si++) {
    const pts = allStrokes[si];
    for (let pi = 0;pi < pts.length; pi++) {
      const p = pts[pi];
      if (bandBottom < p.y - r || bandTop > p.y + r)
        continue;
      const dy = Math.abs((bandTop + bandBottom) / 2 - p.y);
      const dxSq = r * r - dy * dy;
      if (dxSq > 0) {
        const dx = Math.sqrt(dxSq);
        intervals.push({ left: p.x - dx, right: p.x + dx });
      }
      if (pi > 0) {
        const prev = pts[pi - 1];
        const sdx = p.x - prev.x, sdy = p.y - prev.y;
        const segLen = Math.sqrt(sdx * sdx + sdy * sdy);
        const step = r * 0.5;
        if (segLen > step) {
          const count = Math.ceil(segLen / step);
          for (let s = 1;s < count; s++) {
            const t = s / count;
            const ix = prev.x + sdx * t, iy = prev.y + sdy * t;
            if (bandBottom < iy - r || bandTop > iy + r)
              continue;
            const idy = Math.abs((bandTop + bandBottom) / 2 - iy);
            const idxSq = r * r - idy * idy;
            if (idxSq > 0) {
              const idx = Math.sqrt(idxSq);
              intervals.push({ left: ix - idx, right: ix + idx });
            }
          }
        }
      }
    }
  }
  if (intervals.length <= 1)
    return intervals;
  intervals.sort((a, b) => a.left - b.left);
  const merged = [intervals[0]];
  for (let i = 1;i < intervals.length; i++) {
    const curr = intervals[i];
    const last = merged[merged.length - 1];
    if (curr.left <= last.right) {
      if (curr.right > last.right)
        last.right = curr.right;
    } else
      merged.push(curr);
  }
  return merged;
}
function getImageIntervalsForBand(bandTop, bandBottom) {
  const intervals = [];
  const pad = 8;
  for (let i = 0;i < placedImages.length; i++) {
    const img = placedImages[i];
    const cx = img.x + img.w / 2;
    const cy = img.y + img.h / 2;
    const r = Math.min(img.w, img.h) / 2;
    if (img.shape === "original") {
      if (bandBottom <= img.y - pad || bandTop >= img.y + img.h + pad)
        continue;
      if (img.alphaEdges) {
        const rows = img.alphaEdges.length;
        const rowTop = Math.max(0, Math.floor((bandTop - img.y) / img.h * rows));
        const rowBot = Math.min(rows - 1, Math.ceil((bandBottom - img.y) / img.h * rows));
        let minL = Infinity, maxR = -Infinity;
        for (let row = rowTop;row <= rowBot; row++) {
          const e = img.alphaEdges[row];
          if (e) {
            const l = img.x + e.left * img.w;
            const r2 = img.x + e.right * img.w;
            if (l < minL)
              minL = l;
            if (r2 > maxR)
              maxR = r2;
          }
        }
        if (minL < maxR)
          intervals.push({ left: minL - pad, right: maxR + pad });
      } else {
        intervals.push({ left: img.x - pad, right: img.x + img.w + pad });
      }
    } else if (img.shape === "square") {
      const side = Math.min(img.w, img.h);
      const sx = cx - side / 2, sy = cy - side / 2;
      if (bandBottom <= sy - pad || bandTop >= sy + side + pad)
        continue;
      intervals.push({ left: sx - pad, right: sx + side + pad });
    } else if (img.shape === "circle") {
      if (bandBottom < cy - r - pad || bandTop > cy + r + pad)
        continue;
      let maxDx = 0;
      for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
        const dy = sy - cy;
        const rp = r + pad;
        const dxSq = rp * rp - dy * dy;
        if (dxSq > 0) {
          const dx = Math.sqrt(dxSq);
          if (dx > maxDx)
            maxDx = dx;
        }
      }
      if (maxDx > 0)
        intervals.push({ left: cx - maxDx, right: cx + maxDx });
    } else if (img.shape === "heart") {
      if (bandBottom < cy - r * 1.3 - pad || bandTop > cy + r + pad)
        continue;
      let maxHW = 0;
      for (const sy of [bandTop, (bandTop + bandBottom) / 2, bandBottom]) {
        const relY = (sy - (cy - r)) / (2 * r);
        let hw;
        if (relY < 0.35)
          hw = r * (0.7 + 0.3 * Math.sin(relY / 0.35 * Math.PI));
        else
          hw = r * Math.max(0, 1 - (relY - 0.35) / 0.65);
        if (hw > maxHW)
          maxHW = hw;
      }
      if (maxHW > 0)
        intervals.push({ left: cx - maxHW - pad, right: cx + maxHW + pad });
    }
  }
  return intervals;
}
function carveSlots(base, blocked) {
  let slots = [base];
  for (let bi = 0;bi < blocked.length; bi++) {
    const b = blocked[bi];
    const next = [];
    for (let si = 0;si < slots.length; si++) {
      const slot = slots[si];
      if (b.right <= slot.left || b.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (b.left > slot.left)
        next.push({ left: slot.left, right: b.left });
      if (b.right < slot.right)
        next.push({ left: b.right, right: slot.right });
    }
    slots = next;
  }
  return slots.filter(function(s) {
    return s.right - s.left >= 20;
  });
}
var QLINES_META = [
  { font: 'bold 18px "Playfair Display"', text: "SIMPLICITY IS ABOUT", yOff: 16, h: 28 },
  { font: 'bold 22px "Playfair Display"', text: "SUBTRACTING THE", yOff: 44, h: 32 },
  { font: 'bold 36px "Playfair Display"', text: "OBVIOUS", yOff: 76, h: 42 },
  { font: 'bold 22px "Playfair Display"', text: "AND ADDING THE", yOff: 118, h: 34 },
  { font: 'bold 40px "Playfair Display"', text: "MEANINGFUL.", yOff: 152, h: 48 }
];
var quoteLineWidths = [];
function cacheQuoteWidths() {
  quoteLineWidths = [];
  for (const ql of QLINES_META) {
    ctx.font = ql.font;
    quoteLineWidths.push(ctx.measureText(ql.text).width);
  }
}
function getQuoteIntervalForBand(bandTop, bandBottom) {
  if (mode !== "desktop")
    return [];
  const pad = 4;
  const cx = quoteX + QUOTE_W / 2;
  const first = QLINES_META[0];
  const last = QLINES_META[QLINES_META.length - 1];
  const qTop = quoteY + first.yOff;
  const qBot = quoteY + last.yOff + last.h;
  if (bandBottom <= qTop - 2 || bandTop >= qBot + 2)
    return [];
  let maxHalfW = 0;
  for (let i = 0;i < QLINES_META.length; i++) {
    const ql = QLINES_META[i];
    const lineTop = quoteY + ql.yOff;
    const lineBot = lineTop + ql.h;
    if (bandBottom > lineTop - pad && bandTop < lineBot + pad) {
      if (quoteLineWidths[i] / 2 > maxHalfW)
        maxHalfW = quoteLineWidths[i] / 2;
    }
  }
  if (maxHalfW === 0) {
    const bandMid = (bandTop + bandBottom) / 2;
    let minDist = Infinity;
    for (let i = 0;i < QLINES_META.length; i++) {
      const lineMid = quoteY + QLINES_META[i].yOff + QLINES_META[i].h / 2;
      const d = Math.abs(bandMid - lineMid);
      if (d < minDist) {
        minDist = d;
        maxHalfW = quoteLineWidths[i] / 2;
      }
    }
  }
  if (maxHalfW <= 0)
    return [];
  return [{ left: cx - maxHalfW - pad, right: cx + maxHalfW + pad }];
}
function getAutoImgIntervalForBand(bandTop, bandBottom) {
  if (!autoImgActive)
    return [];
  const pad = 8;
  if (bandBottom <= autoImgY - pad || bandTop >= autoImgY + autoImgH + pad)
    return [];
  if (autoImgAlphaEdges) {
    const rows = autoImgAlphaEdges.length;
    const rowTop = Math.max(0, Math.floor((bandTop - autoImgY) / autoImgH * rows));
    const rowBot = Math.min(rows - 1, Math.ceil((bandBottom - autoImgY) / autoImgH * rows));
    let minL = Infinity, maxR = -Infinity;
    for (let row = rowTop;row <= rowBot; row++) {
      const e = autoImgAlphaEdges[row];
      if (e) {
        const l = autoImgX + e.left * autoImgW;
        const r = autoImgX + e.right * autoImgW;
        if (l < minL)
          minL = l;
        if (r > maxR)
          maxR = r;
      }
    }
    if (minL < maxR)
      return [{ left: minL - pad, right: maxR + pad }];
    return [];
  }
  return [{ left: autoImgX - pad, right: autoImgX + autoImgW + pad }];
}
var HEAT_RADIUS = 250;
function heatColor(wx, wy, baseColor) {
  if (!desktopMouse)
    return baseColor;
  const dx = wx - desktopMouse.x;
  const dy = wy - desktopMouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > HEAT_RADIUS)
    return baseColor;
  const t = 1 - dist / HEAT_RADIUS;
  if (t < 0.3) {
    const s = t / 0.3;
    const r = Math.round(180 + 75 * s);
    const g = Math.round(180 + 55 * s);
    const b = Math.round(200 - 80 * s);
    return `rgb(${r},${g},${b})`;
  } else if (t < 0.6) {
    const s = (t - 0.3) / 0.3;
    const r = 255;
    const g = Math.round(235 - 120 * s);
    const b = Math.round(120 - 90 * s);
    return `rgb(${r},${g},${b})`;
  } else {
    const s = (t - 0.6) / 0.4;
    const r = 255;
    const g = Math.round(115 - 80 * s);
    const b = Math.round(30 + 20 * s);
    return `rgb(${r},${g},${b})`;
  }
}
function deskColumn(paras, startPara, startCursor, left, right, startY, maxY, font, lh, pg, color) {
  ctx.font = font;
  let y = startY;
  let paraIdx = startPara;
  let cursor = startCursor;
  const spaceW = ctx.measureText(" ").width;
  while (paraIdx < paras.length) {
    const prepared = paras[paraIdx];
    let done = false;
    while (y + lh <= maxY && !done) {
      const bandTop = y;
      const bandBottom = y + lh;
      const blocked = getQuoteIntervalForBand(bandTop, bandBottom).concat(getAutoImgIntervalForBand(bandTop, bandBottom)).concat(getImageIntervalsForBand(bandTop, bandBottom)).concat(getFingerIntervalsForBand(bandTop, bandBottom)).concat(getStrokeIntervalsForBand(bandTop, bandBottom));
      const slots = carveSlots({ left, right }, blocked);
      if (slots.length === 0) {
        y += lh;
        continue;
      }
      for (let si = 0;si < slots.length; si++) {
        const slot = slots[si];
        const line = layoutNextLine(prepared, cursor, slot.right - slot.left);
        if (line === null) {
          done = true;
          break;
        }
        if (desktopMouse) {
          const words = line.text.split(" ");
          let wx = slot.left;
          ctx.font = font;
          for (let wi = 0;wi < words.length; wi++) {
            const word = words[wi];
            if (word === "")
              continue;
            const ww = ctx.measureText(word).width;
            const wcx = wx + ww / 2;
            const wcy = y + lh / 2;
            const dx = wcx - desktopMouse.x;
            const dy = wcy - desktopMouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const R = HEAT_RADIUS;
            let ox = 0, oy = 0;
            if (dist < R && dist > 0.1) {
              const t = 1 - dist / R;
              const push = t * t * 30;
              ox = dx / dist * push;
              oy = dy / dist * push;
            }
            ctx.fillStyle = heatColor(wcx, wcy, color);
            ctx.fillText(word, wx + ox, y + oy);
            wx += ww + spaceW;
          }
        } else {
          ctx.fillStyle = color;
          ctx.fillText(line.text, slot.left, y);
        }
        cursor = line.end;
      }
      y += lh;
    }
    if (done) {
      paraIdx++;
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      if (paraIdx < paras.length)
        y += pg;
    } else
      break;
  }
  return { paraIdx, cursor, y };
}
function render() {
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = "top";
  ctx.globalAlpha = 1;
  const topOffset = TOP_BAR_HEIGHT;
  if (mode === "mobile") {
    if (preparedParas.length === 0)
      return;
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    let y = PADDING + topOffset;
    const maxY = H - PADDING;
    for (let paraIdx = 0;paraIdx < preparedParas.length; paraIdx++) {
      const prepared = preparedParas[paraIdx];
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let paraDone = false;
      while (y + LINE_HEIGHT <= maxY && !paraDone) {
        const bandTop = y;
        const bandBottom = y + LINE_HEIGHT;
        const blocked = getImageIntervalsForBand(bandTop, bandBottom).concat(getStrokeIntervalsForBand(bandTop, bandBottom)).concat(getFingerIntervalsForBand(bandTop, bandBottom));
        const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked);
        if (slots.length === 0) {
          y += LINE_HEIGHT;
          continue;
        }
        for (let si = 0;si < slots.length; si++) {
          const slot = slots[si];
          const width = slot.right - slot.left;
          const line = layoutNextLine(prepared, cursor, width);
          if (line === null) {
            paraDone = true;
            break;
          }
          ctx.fillText(line.text, slot.left, bandTop);
          cursor = line.end;
        }
        y += LINE_HEIGHT;
      }
      if (paraIdx < preparedParas.length - 1)
        y += PARA_GAP;
    }
  } else {
    if (preparedDesk.length === 0)
      return;
    const pad = DESK_PAD;
    const gap = DESK_COL_GAP;
    const colWidth = (W - pad * 2 - gap * 2) / 3;
    const col1L = pad, col1R = col1L + colWidth;
    const col2L = col1R + gap, col2R = col2L + colWidth;
    const col3L = col2R + gap, col3R = col3L + colWidth;
    const startY = pad + topOffset;
    const maxY = H - pad;
    let c1y = startY;
    if (preparedTitle) {
      ctx.font = DESK_TITLE_FONT;
      ctx.fillStyle = "#ffffff";
      let titleCursor = { segmentIndex: 0, graphemeIndex: 0 };
      while (c1y + DESK_TITLE_LH <= maxY) {
        const blocked = getQuoteIntervalForBand(c1y, c1y + DESK_TITLE_LH).concat(getAutoImgIntervalForBand(c1y, c1y + DESK_TITLE_LH)).concat(getFingerIntervalsForBand(c1y, c1y + DESK_TITLE_LH)).concat(getImageIntervalsForBand(c1y, c1y + DESK_TITLE_LH)).concat(getStrokeIntervalsForBand(c1y, c1y + DESK_TITLE_LH));
        const slots = carveSlots({ left: col1L, right: col1R }, blocked);
        if (slots.length === 0) {
          c1y += DESK_TITLE_LH;
          continue;
        }
        const line = layoutNextLine(preparedTitle, titleCursor, slots[0].right - slots[0].left);
        if (line === null)
          break;
        ctx.fillStyle = heatColor(slots[0].left + line.width / 2, c1y + DESK_TITLE_LH / 2, "#ffffff");
        ctx.fillText(line.text, slots[0].left, c1y);
        titleCursor = line.end;
        c1y += DESK_TITLE_LH;
      }
      c1y += 8;
    }
    if (preparedSub) {
      ctx.font = DESK_SUB_FONT;
      const subLH = 26;
      let subCursor = { segmentIndex: 0, graphemeIndex: 0 };
      while (c1y + subLH <= maxY) {
        const blocked = getQuoteIntervalForBand(c1y, c1y + subLH).concat(getAutoImgIntervalForBand(c1y, c1y + subLH)).concat(getFingerIntervalsForBand(c1y, c1y + subLH)).concat(getImageIntervalsForBand(c1y, c1y + subLH)).concat(getStrokeIntervalsForBand(c1y, c1y + subLH));
        const slots = carveSlots({ left: col1L, right: col1R }, blocked);
        if (slots.length === 0) {
          c1y += subLH;
          continue;
        }
        const line = layoutNextLine(preparedSub, subCursor, slots[0].right - slots[0].left);
        if (line === null)
          break;
        ctx.fillStyle = heatColor(slots[0].left + line.width / 2, c1y + subLH / 2, "rgba(255,255,255,0.45)");
        ctx.fillText(line.text, slots[0].left, c1y);
        subCursor = line.end;
        c1y += subLH;
      }
      c1y += 14;
    }
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(col1L, c1y);
    ctx.lineTo(col1R, c1y);
    ctx.stroke();
    c1y += 16;
    const r1 = deskColumn(preparedDesk, 0, { segmentIndex: 0, graphemeIndex: 0 }, col1L, col1R, c1y, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR);
    const r2 = deskColumn(preparedDesk, r1.paraIdx, r1.cursor, col2L, col2R, startY, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR);
    deskColumn(preparedDesk, r2.paraIdx, r2.cursor, col3L, col3R, startY, maxY, DESK_FONT, DESK_LINE_HEIGHT, DESK_PARA_GAP, DESK_TEXT_COLOR);
    const qcx = quoteX + QUOTE_W / 2;
    ctx.textAlign = "center";
    const qLines = [
      { text: "SIMPLICITY IS ABOUT", font: 'bold 18px "Playfair Display"', color: "#f2c4b8", yOff: 16 },
      { text: "SUBTRACTING THE", font: 'bold 22px "Playfair Display"', color: "#f2c4b8", yOff: 44 },
      { text: "OBVIOUS", font: 'bold 36px "Playfair Display"', color: "#e8ddd4", yOff: 76 },
      { text: "AND ADDING THE", font: 'bold 22px "Playfair Display"', color: "#ffffff", yOff: 118 },
      { text: "MEANINGFUL.", font: 'bold 40px "Playfair Display"', color: "#7ed695", yOff: 152 }
    ];
    for (const ql of qLines) {
      ctx.font = ql.font;
      ctx.fillStyle = ql.color;
      ctx.fillText(ql.text, qcx, quoteY + ql.yOff);
    }
    ctx.textAlign = "left";
  }
}
function centerQuoteInCol2() {
  const pad = DESK_PAD;
  const gap = DESK_COL_GAP;
  const colWidth = (W - pad * 2 - gap * 2) / 3;
  const col2L = pad + colWidth + gap;
  quoteX = col2L + (colWidth - QUOTE_W) / 2;
  quoteY = (H - QUOTE_H) / 2;
}
function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight - BAR_HEIGHT;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  centerQuoteInCol2();
  render();
}
function getClipPath(shape, w, h) {
  if (shape === "circle") {
    const r = Math.min(w, h) / 2;
    const rpw = r / w * 100;
    const rph = r / h * 100;
    return `ellipse(${rpw}% ${rph}% at 50% 50%)`;
  }
  if (shape === "heart")
    return 'path("M 50 90 C 15 55, 5 30, 25 15 C 35 8, 50 15, 50 30 C 50 15, 65 8, 75 15 C 95 30, 85 55, 50 90 Z")';
  if (shape === "square") {
    const side = Math.min(w, h);
    const ox = (w - side) / 2 / w * 100;
    const oy = (h - side) / 2 / h * 100;
    return `inset(${oy}% ${ox}% ${oy}% ${ox}%)`;
  }
  return "none";
}
function syncImageEl(pi) {
  pi.el.style.left = pi.x + "px";
  pi.el.style.top = pi.y + "px";
  pi.el.style.width = pi.w + "px";
  pi.el.style.height = pi.h + "px";
  const cp = getClipPath(pi.shape, pi.w, pi.h);
  pi.el.style.clipPath = cp === "none" ? "" : cp;
  pi.el.style.webkitClipPath = cp === "none" ? "" : cp;
}
function hitTestImage(x, y) {
  for (let i = placedImages.length - 1;i >= 0; i--) {
    const pi = placedImages[i];
    if (x >= pi.x && x <= pi.x + pi.w && y >= pi.y && y <= pi.y + pi.h)
      return pi;
  }
  return null;
}
var pointerDownTime = 0;
var pointerDownPos = { x: 0, y: 0 };
var tappedImage = null;
var draggingImage = null;
var isPinching = false;
var pinchImage = null;
var pinchStartDist = 0;
var pinchStartW = 0;
var pinchStartH = 0;
canvas.addEventListener("touchstart", function(e) {
  if (e.touches.length === 2) {
    const t0 = e.touches[0], t1 = e.touches[1];
    const cx = (t0.clientX + t1.clientX) / 2, cy = (t0.clientY + t1.clientY) / 2;
    const hit = hitTestImage(cx, cy);
    if (hit) {
      e.preventDefault();
      isPinching = true;
      pinchImage = hit;
      pinchStartDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      pinchStartW = hit.w;
      pinchStartH = hit.h;
    }
  }
}, { passive: false });
canvas.addEventListener("touchmove", function(e) {
  if (isPinching && pinchImage && e.touches.length === 2) {
    e.preventDefault();
    const t0 = e.touches[0], t1 = e.touches[1];
    const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
    const scale = dist / pinchStartDist;
    const oldCx = pinchImage.x + pinchImage.w / 2, oldCy = pinchImage.y + pinchImage.h / 2;
    pinchImage.w = Math.max(30, Math.min(W - 20, pinchStartW * scale));
    pinchImage.h = Math.max(30, Math.min(H - 20, pinchStartH * scale));
    pinchImage.x = oldCx - pinchImage.w / 2;
    pinchImage.y = oldCy - pinchImage.h / 2;
    syncImageEl(pinchImage);
    render();
  }
}, { passive: false });
canvas.addEventListener("touchend", function(e) {
  if (isPinching && e.touches.length < 2) {
    isPinching = false;
    pinchImage = null;
  }
});
canvas.addEventListener("pointerdown", function(e) {
  if (isPinching)
    return;
  const { clientX: x, clientY: y } = e;
  pointerDownTime = Date.now();
  pointerDownPos = { x, y };
  if (mode === "desktop" && x >= quoteX && x <= quoteX + QUOTE_W && y >= quoteY && y <= quoteY + QUOTE_H) {
    quoteDragging = true;
    quoteDragOffX = x - quoteX;
    quoteDragOffY = y - quoteY;
    return;
  }
  const hit = hitTestImage(x, y);
  if (hit) {
    tappedImage = hit;
    draggingImage = hit;
    hit.dragging = true;
    hit.dragOffsetX = x - hit.x;
    hit.dragOffsetY = y - hit.y;
    return;
  }
  tappedImage = null;
  draggingImage = null;
  pointer = { x, y };
  currentStroke = [{ x, y }];
  render();
});
canvas.addEventListener("pointermove", function(e) {
  if (isPinching)
    return;
  const { clientX: x, clientY: y } = e;
  if (quoteDragging) {
    quoteX = x - quoteDragOffX;
    quoteY = y - quoteDragOffY;
    render();
    return;
  }
  if (draggingImage) {
    const dx = x - pointerDownPos.x, dy = y - pointerDownPos.y;
    if (dx * dx + dy * dy > 100) {
      tappedImage = null;
      draggingImage.x = x - draggingImage.dragOffsetX;
      draggingImage.y = y - draggingImage.dragOffsetY;
      syncImageEl(draggingImage);
      render();
    }
    return;
  }
  if (pointer) {
    pointer = { x, y };
    if (currentStroke) {
      const last = currentStroke[currentStroke.length - 1];
      if ((x - last.x) * (x - last.x) + (y - last.y) * (y - last.y) > 9) {
        currentStroke.push({ x, y });
        render();
      }
    }
    render();
  }
});
function pointerUp() {
  if (quoteDragging) {
    quoteDragging = false;
    render();
    return;
  }
  if (draggingImage) {
    draggingImage.dragging = false;
    if (tappedImage && Date.now() - pointerDownTime < 300) {
      const idx = SHAPES.indexOf(tappedImage.shape);
      tappedImage.shape = SHAPES[(idx + 1) % SHAPES.length];
      syncImageEl(tappedImage);
      render();
    }
    draggingImage = null;
    tappedImage = null;
    return;
  }
  pointer = null;
  if (currentStroke && currentStroke.length > 0) {
    strokes.push(currentStroke);
  }
  currentStroke = null;
  render();
  render();
}
canvas.addEventListener("pointerup", pointerUp);
canvas.addEventListener("pointercancel", pointerUp);
var fallingWords = [];
var isFalling = false;
function collectVisibleWords() {
  const result = [];
  if (preparedParas.length === 0)
    return result;
  ctx.font = FONT;
  let y = PADDING;
  const maxY = H - PADDING;
  for (let paraIdx = 0;paraIdx < preparedParas.length; paraIdx++) {
    const prepared = preparedParas[paraIdx];
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let paraDone = false;
    while (y + LINE_HEIGHT <= maxY && !paraDone) {
      const bandTop = y;
      const bandBottom = y + LINE_HEIGHT;
      const blocked = getImageIntervalsForBand(bandTop, bandBottom).concat(getStrokeIntervalsForBand(bandTop, bandBottom));
      const slots = carveSlots({ left: PADDING, right: W - PADDING }, blocked);
      if (slots.length === 0) {
        y += LINE_HEIGHT;
        continue;
      }
      for (let si = 0;si < slots.length; si++) {
        const slot = slots[si];
        const line = layoutNextLine(prepared, cursor, slot.right - slot.left);
        if (line === null) {
          paraDone = true;
          break;
        }
        const lineWords = line.text.split(" ");
        let wx = slot.left;
        for (const word of lineWords) {
          if (word === "")
            continue;
          const wm = ctx.measureText(word + " ").width;
          result.push({ text: word, x: wx, y: bandTop, vy: Math.random() * 2, vx: (Math.random() - 0.5) * 3, landed: false });
          wx += wm;
        }
        cursor = line.end;
      }
      y += LINE_HEIGHT;
    }
    if (paraIdx < preparedParas.length - 1)
      y += PARA_GAP;
  }
  return result;
}
function triggerFall() {
  if (isFalling)
    return;
  isFalling = true;
  fallingWords = collectVisibleWords();
  function animateFall() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "top";
    let allLanded = true;
    const groundY = H - LINE_HEIGHT - 4;
    for (let i = 0;i < fallingWords.length; i++) {
      const fw = fallingWords[i];
      if (!fw.landed) {
        fw.vy += 0.8;
        fw.y += fw.vy;
        fw.x += fw.vx;
        fw.vx *= 0.98;
        if (fw.y >= groundY) {
          fw.y = groundY;
          fw.vy = -fw.vy * 0.3;
          if (Math.abs(fw.vy) < 2) {
            fw.landed = true;
            fw.vy = 0;
          }
        }
        allLanded = false;
      }
      ctx.fillText(fw.text, fw.x, fw.y);
    }
    if (!allLanded) {
      requestAnimationFrame(animateFall);
    } else {
      setTimeout(function() {
        fallingWords = [];
        isFalling = false;
        render();
      }, 1500);
    }
  }
  requestAnimationFrame(animateFall);
}
var shakeBtn = document.getElementById("shake-btn");
if (shakeBtn) {
  shakeBtn.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
  });
  shakeBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    triggerFall();
  });
}
var resetBtn = document.getElementById("reset-btn");
if (resetBtn) {
  resetBtn.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
  });
  resetBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    for (let i = 0;i < placedImages.length; i++) {
      if (placedImages[i] !== defaultDanceImage)
        placedImages[i].el.remove();
    }
    placedImages.length = 0;
    pointer = null;
    strokes.length = 0;
    currentStroke = null;
    if (defaultDanceImage) {
      defaultDanceImage.x = DESK_PAD;
      defaultDanceImage.y = TOP_BAR_HEIGHT + DESK_PAD;
      syncImageEl(defaultDanceImage);
      placedImages.push(defaultDanceImage);
    }
    centerQuoteInCol2();
    render();
  });
}
var modeMobileBtn = document.getElementById("mode-mobile");
var modeDesktopBtn = document.getElementById("mode-desktop");
function setMode(m) {
  mode = m;
  if (m === "desktop") {
    centerQuoteInCol2();
    if (autoImgActive)
      startAutoImgAnim();
  } else {
    stopAutoImgAnim();
  }
  if (modeMobileBtn && modeDesktopBtn) {
    modeMobileBtn.classList.toggle("mode-active", m === "mobile");
    modeDesktopBtn.classList.toggle("mode-active", m === "desktop");
  }
  render();
}
if (modeMobileBtn) {
  modeMobileBtn.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
  });
  modeMobileBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    setMode("mobile");
  });
}
if (modeDesktopBtn) {
  modeDesktopBtn.addEventListener("pointerdown", function(e) {
    e.stopPropagation();
  });
  modeDesktopBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    setMode("desktop");
  });
}
function syncAutoImgEl() {
  if (!autoImgEl)
    return;
  autoImgEl.style.left = autoImgX + "px";
  autoImgEl.style.top = autoImgY + "px";
  autoImgEl.style.width = autoImgW + "px";
  autoImgEl.style.height = autoImgH + "px";
}
var autoImgAnimId = 0;
function startAutoImgAnim() {
  function tick() {
    if (!autoImgActive || mode !== "desktop") {
      autoImgAnimId = 0;
      return;
    }
    autoImgX += autoImgVx;
    autoImgY += autoImgVy;
    const minX = DESK_PAD;
    const maxX = W - DESK_PAD - autoImgW;
    const minY = TOP_BAR_HEIGHT + DESK_PAD;
    const maxYB = H - DESK_PAD - autoImgH;
    if (autoImgX <= minX || autoImgX >= maxX)
      autoImgVx = -autoImgVx;
    if (autoImgY <= minY || autoImgY >= maxYB)
      autoImgVy = -autoImgVy;
    autoImgX = Math.max(minX, Math.min(maxX, autoImgX));
    autoImgY = Math.max(minY, Math.min(maxYB, autoImgY));
    syncAutoImgEl();
    render();
    autoImgAnimId = requestAnimationFrame(tick);
  }
  if (!autoImgAnimId)
    autoImgAnimId = requestAnimationFrame(tick);
}
function stopAutoImgAnim() {
  if (autoImgEl) {
    autoImgEl.remove();
    autoImgEl = null;
  }
  autoImgActive = false;
  autoImgAnimId = 0;
}
canvas.addEventListener("mousemove", function(e) {
  if (mode === "desktop") {
    if (e.clientY < TOP_BAR_HEIGHT + 10 || e.clientY > H - 10) {
      if (desktopMouse) {
        desktopMouse = null;
        render();
      }
      return;
    }
    desktopMouse = { x: e.clientX, y: e.clientY };
    render();
  }
});
canvas.addEventListener("mouseleave", function() {
  desktopMouse = null;
  if (mode === "desktop")
    render();
});
try {
  for (let i = 0;i < PARAGRAPHS.length; i++) {
    preparedParas.push(prepareWithSegments(PARAGRAPHS[i], FONT));
    preparedDesk.push(prepareWithSegments(PARAGRAPHS[i], DESK_FONT));
  }
  preparedQuote = prepareWithSegments(QUOTE_TEXT, QUOTE_FONT);
  preparedTitle = prepareWithSegments(TITLE_TEXT, DESK_TITLE_FONT);
  preparedSub = prepareWithSegments(SUB_TEXT, DESK_SUB_FONT);
  cacheQuoteWidths();
} catch (e) {
  console.error("prepareWithSegments failed:", e);
}
window.addEventListener("resize", resize);
resize();
var defaultDanceImage = null;
{
  const danceImg = new Image;
  danceImg.onload = function() {
    const maxSize = 150;
    const scale = Math.min(maxSize / danceImg.width, maxSize / danceImg.height, 1);
    const w = danceImg.width * scale, h = danceImg.height * scale;
    const el = document.createElement("img");
    el.src = danceImg.src;
    el.className = "placed-image";
    el.style.cssText = "position:fixed;pointer-events:none;z-index:2;";
    document.body.appendChild(el);
    const placed = {
      el,
      dataUrl: danceImg.src,
      x: DESK_PAD,
      y: TOP_BAR_HEIGHT + DESK_PAD,
      w,
      h,
      shape: "original",
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      alphaEdges: null
    };
    syncImageEl(placed);
    placedImages.push(placed);
    defaultDanceImage = placed;
    render();
  };
  danceImg.src = "./Dance Dancing Sticker by Neil Sanders.gif";
}
console.log("Text Playground: ready");
