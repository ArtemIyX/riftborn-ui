import {defineStore} from 'pinia';
import {getLocText, getLocTextArray} from "@/assets/js/localization.js";
import {ref, computed} from 'vue';


export const useLocalizationStore = defineStore('localization', () => {
  // State
  const cache = ref(new Map());

  // Getters
  const getCached = computed(() => (table, key) => {
    const cacheKey = `${table}:${key}`;
    return cache.value.get(cacheKey);
  });

  const hasCached = computed(() => (table, key) => {
    const cacheKey = `${table}:${key}`;
    return cache.value.has(cacheKey);
  });

  const getCacheStats = computed(() => ({
    size: cache.value.size,
    keys: Array.from(cache.value.keys())
  }));

  // Actions
  const getText = async (key, table, defaultValue) => {
    const cacheKey = `${table}:${key}`;

    // Check cache first
    if (cache.value.has(cacheKey)) {
      return cache.value.get(cacheKey);
    }

    // Fetch from server
    const response = await getLocText(key, table, defaultValue);
    const result = response.result;

    // Cache the result (even if it's the default value)
    cache.value.set(cacheKey, result);

    return result;
  };

  const getTextArray = async (requests) => {
    const results = [];
    const toFetch = [];
    const fetchIndices = [];

    // Check cache for each request
    requests.forEach((request, index) => {
      const cacheKey = `${request.table}:${request.key}`;

      if (cache.value.has(cacheKey)) {
        results[index] = cache.value.get(cacheKey);
      } else {
        toFetch.push(request);
        fetchIndices.push(index);
      }
    });

    // Fetch missing items if any
    if (toFetch.length > 0) {
      const responses = await getLocTextArray(toFetch);

      // Cache and assign fetched results
      responses.forEach((response, fetchIndex) => {
        const originalIndex = fetchIndices[fetchIndex];
        const cacheKey = `${response.table}:${response.key}`;

        cache.value.set(cacheKey, response.result);
        results[originalIndex] = response.result;
      });
    }

    return results;
  };

  const setCached = (table, key, value) => {
    const cacheKey = `${table}:${key}`;
    cache.value.set(cacheKey, value);
  };

  const clearCached = (table, key) => {
    const cacheKey = `${table}:${key}`;
    cache.value.delete(cacheKey);
  };

  const clearAll = () => {
    cache.value.clear();
  };


  return {
    // State
    cache,

    // Getters
    getCached,
    hasCached,
    getCacheStats,

    // Actions
    getText,
    getTextArray,
    setCached,
    clearCached,
    clearAll
  };
});
