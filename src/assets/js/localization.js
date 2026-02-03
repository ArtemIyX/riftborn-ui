export const fetchLocalization = async (key, table) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1);
  });
};

export const fetchLocalizationArray = async (array) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1);
  });
};


export const getLocText = async (key, table, defaultValue) => {
  try {
    const localizedText = await fetchLocalization(key, table);

    if (localizedText) {
      return localizedText;
    } else {
      return defaultValue;
    }
  } catch (error) {
    // Error occurred, use default
    console.error('Failed to fetch localization:', error);
    return defaultValue;
  }
}

/**
 * Fetches localized text for an array of localization requests.
 * If the server fails to return data, falls back to default values.
 *
 * @async
 * @function getLocTextArray
 *
 * @param {LocalizationRequest[]} arr - Array of localization requests
 * @param {string} arr[].key - Localization key identifier
 * @param {string} arr[].table - Localization table name
 * @param {string} arr[].defaultValue - Fallback value if localization fails
 *
 * @returns {Promise<LocalizationResult[]>} Array of localization results
 * @returns {string} return[].key - Localization key identifier
 * @returns {string} return[].table - Localization table name
 * @returns {string} return[].result - Localized text or default value
 * @returns {boolean} return[].success - True if localization succeeded, false otherwise
 *
 * @throws {Error} Catches and logs any errors from fetchLocalizationArray
 *
 * @example
 * const requests = [
 *   { key: 'GREETING', table: 'UI', defaultValue: 'Hello' },
 *   { key: 'FAREWELL', table: 'UI', defaultValue: 'GOOD' }
 * ];
 *
 * const results = await getLocTextArray(requests);
 * // Returns:
 * // [
 * //   { key: 'GREETING', table: 'UI', result: 'Hello', success: true },
 * //   { key: 'FAREWELL', table: 'UI', result: 'GOOD', success: false }
 * // ]
 *
 * @returns {Promise<Array<{key: string, table: string, result: string, success: boolean}>>}
 */
export const getLocTextArray = async (arr) => {
  try {
    const localizedArr = await fetchLocalizationArray(arr);

    if (localizedArr) {
      return localizedArr;
    } else {
      // Server returned falsy value, create fallback array
      return arr.map(item => ({
        key: item.key,
        table: item.table,
        result: item.defaultValue,
        success: false
      }));
    }
  } catch (error) {
    // Error occurred, use default values
    console.error('Failed to fetch localization:', error);
    return arr.map(item => ({
      key: item.key,
      table: item.table,
      result: item.defaultValue,
      success: false
    }));
  }
}
