/**
 * ജനകീയ ക്വിസ് — Leaderboard Module
 * Handles localStorage-based leaderboard persistence.
 */
const Leaderboard = (() => {
  'use strict';

  /**
   * Read all leaderboard entries from localStorage.
   * @returns {Array} Sorted array of entry objects.
   */
  function getEntries() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return [];
      const entries = JSON.parse(raw);
      if (!Array.isArray(entries)) return [];
      return _sort(entries);
    } catch (e) {
      console.warn('Leaderboard: failed to read localStorage', e);
      return [];
    }
  }

  /**
   * Save a new entry to the leaderboard.
   * @param {Object} entry { name, topic, topicLabel, score, total, percent, time, date, passed }
   */
  function saveEntry(entry) {
    try {
      const entries = getEntries();
      entries.push(entry);
      const sorted = _sort(entries).slice(0, CONFIG.MAX_LEADERBOARD);
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.warn('Leaderboard: failed to save entry', e);
    }
  }

  /**
   * Clear the entire leaderboard.
   */
  function clearAll() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (e) {
      console.warn('Leaderboard: failed to clear', e);
    }
  }

  /**
   * Get entries filtered by topic id.
   * @param {string} topicId Topic identifier.
   * @returns {Array} Filtered and sorted entries.
   */
  function getByTopic(topicId) {
    if (!topicId || topicId === 'all') return getEntries();
    return getEntries().filter(e => e.topic === topicId);
  }

  /**
   * Check if localStorage is available.
   * @returns {boolean}
   */
  function isAvailable() {
    try {
      const testKey = '__cq_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Sort entries: percent DESC, then time ASC (faster is better).
   * @param {Array} entries
   * @returns {Array} Sorted copy.
   */
  function _sort(entries) {
    return entries.slice().sort((a, b) => {
      if (b.percent !== a.percent) return b.percent - a.percent;
      // Parse time "m:ss" to seconds for comparison
      const aTime = _timeToSeconds(a.time);
      const bTime = _timeToSeconds(b.time);
      return aTime - bTime; // lower time (faster) is better
    });
  }

  /**
   * Convert "m:ss" time string to total seconds.
   * @param {string} timeStr e.g. "4:23"
   * @returns {number} Total seconds.
   */
  function _timeToSeconds(timeStr) {
    if (!timeStr) return 9999;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return 9999;
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }

  /* Public API */
  return {
    getEntries,
    saveEntry,
    clearAll,
    getByTopic,
    isAvailable,
  };
})();
