const crypto = require('crypto')
const cheerio = require('cheerio')

/**
 * Hash a string using SHA-256
 */
function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Normalize HTML to make hashing stable (removes extra spaces and line breaks)
 */
function normalizeHtml(html) {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

/**
 * Split HTML into clean content blocks (like <p>, <h1>, etc.)
 */
function splitIntoChunks(html) {
  const normalized = normalizeHtml(html)
  const $ = cheerio.load(normalized)
  const chunks = []

  $('p, h1, h2, h3, h4, li, blockquote, pre, div').each((_, el) => {
    const chunk = $(el).html()?.trim()
    if (chunk) chunks.push(chunk)
  })

  return chunks
}

/**
 * Generate SHA-256 hashes for each content block
 */
function generateChunkHashes(htmlContent) {
  const chunks = splitIntoChunks(htmlContent)
  return chunks.map(chunk => hash(chunk))
}

/**
 * Compare two versions of hash arrays and find changes
 */
function getChangedChunks(oldHashes, newHashes) {
  const oldSet = new Set(oldHashes)
  const newSet = new Set(newHashes)

  const added = []
  const removed = []

  newHashes.forEach((hash, i) => {
    if (!oldSet.has(hash)) added.push(i)
  })

  oldHashes.forEach((hash, i) => {
    if (!newSet.has(hash)) removed.push(i)
  })

  return { added, removed }
}

module.exports = {
  hash,
  normalizeHtml,
  splitIntoChunks,
  generateChunkHashes,
  getChangedChunks
}
