// eslint-disable-next-line @typescript-eslint/no-explicit-any
// @ts-ignore
// Declare chrome for TypeScript (for extension context)
declare const chrome: any;

// Embedding cache for label embeddings using SHA-1 as key
// Supports in-memory and chrome.storage.local caching

/**
 * Compute SHA-1 hash of a string and return as hex.
 * Minimal implementation for short strings.
 */
export async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// In-memory cache
const memoryCache = new Map<string, number[]>();

/**
 * Get embedding for a label, using in-memory and chrome.storage.local cache.
 * @param label The label text
 * @param embedFn Function to compute embedding if not cached
 * @returns The embedding vector
 */
export async function getEmbedding(
  label: string,
  embedFn: (label: string) => Promise<number[]>
): Promise<number[]> {
  const key = await sha1(label);
  // 1. Check in-memory cache
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }
  // 2. Check chrome.storage.local
  const storageKey = `embedding_${key}`;
  const result = await new Promise<{ [k: string]: number[] }>((resolve) => {
    chrome.storage.local.get([storageKey], resolve);
  });
  if (result[storageKey]) {
    memoryCache.set(key, result[storageKey]);
    return result[storageKey];
  }
  // 3. Compute embedding
  const embedding = await embedFn(label);
  memoryCache.set(key, embedding);
  chrome.storage.local.set({ [storageKey]: embedding });
  return embedding;
}

/**
 * Clear the in-memory and chrome.storage.local embedding cache (for dev/testing)
 */
export async function clearEmbeddingCache() {
  memoryCache.clear();
  // Remove all keys starting with 'embedding_'
  const all = await new Promise<{ [k: string]: any }>((resolve) => {
    chrome.storage.local.get(null, resolve);
  });
  const keys = Object.keys(all).filter((k) => k.startsWith('embedding_'));
  if (keys.length) {
    chrome.storage.local.remove(keys);
  }
} 