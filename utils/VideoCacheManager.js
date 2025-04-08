// utils/videoCacheManager.js

/**
 * Simple in-memory cache for interview videos
 * In a production app, consider using a more robust solution like Redis or database storage
 */
const videoCache = new Map();

/**
 * Get a cached video URL for a question if available
 * @param {string} questionText - The interview question text
 * @returns {string|null} - The cached video URL or null if not found
 */
export function getCachedVideo(questionText) {
  if (!questionText) return null;
  const cacheKey = createCacheKey(questionText);
  return videoCache.get(cacheKey) || null;
}

/**
 * Cache a video URL for future use
 * @param {string} questionText - The interview question text 
 * @param {string} videoUrl - The generated video URL
 */
export function cacheVideo(questionText, videoUrl) {
  if (!questionText || !videoUrl) return;
  const cacheKey = createCacheKey(questionText);
  videoCache.set(cacheKey, videoUrl);
}

/**
 * Create a consistent cache key from question text
 * @param {string} text - The question text
 * @returns {string} - A hash to use as cache key
 */
function createCacheKey(text) {
  // Simple hashing function for cache keys
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `question_${hash}`;
}

/**
 * Clear the video cache
 */
export function clearVideoCache() {
  videoCache.clear();
}