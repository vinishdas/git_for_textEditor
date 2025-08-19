// utils/htmlHashUtils.ts
/**
 * Hash a string using SHA-256 (Web Crypto API)
 */
export async function hash(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Normalize HTML to make hashing stable (removes extra spaces and line breaks)
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

/**
 * Split HTML into clean chunks (p, h1, h2, h3, li, div, etc.)
 * Uses browser DOMParser instead of Cheerio
 */
export function splitIntoChunks(html: string): string[] {
  const normalized = normalizeHtml(html)
  const parser = new DOMParser()
  const doc = parser.parseFromString(normalized, 'text/html')

  const selector = 'p, h1, h2, h3, h4, li, blockquote, pre, div'
  const elements = Array.from(doc.querySelectorAll(selector))

  return elements
    .map((el) => el.outerHTML.trim())
    .filter((chunk) => chunk.length > 0)
}

/**
 * Generate SHA-256 hashes for each content block
 */
export async function generateChunkHashes(htmlContent: string): Promise<{
  chunks: string[],
  hashes: string[]
}> {
  const chunks = splitIntoChunks(htmlContent)
  const hashPromises = chunks.map(chunk => hash(chunk))
  const hashes = await Promise.all(hashPromises)
  return { chunks, hashes }
}


/**
 * Compare two versions of hash arrays and find changes
 */
export function getChangedChunks(
  oldHashes: string[],
  newHashes: string[]
): { added: number[]; removed: number[] } {
  const oldSet = new Set(oldHashes)
  const newSet = new Set(newHashes)

  const added: number[] = []
  const removed: number[] = []
  

  newHashes.forEach((hash, i) => {
    if (!oldSet.has(hash)) added.push(i)
  })

  oldHashes.forEach((hash, i) => {
    if (!newSet.has(hash)) removed.push(i)
  })
  
  return { added, removed }
}
