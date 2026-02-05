export const getLocText = async (key, table, defaultValue) => {
  const createResult = (success, result) => ({
    key,
    table,
    result,
    success
  });

  const request = {key, table};

  try {
    //console.log("Localization request:", JSON.stringify(request));

    // Check if UE backend is available
    if (!window.ue?.handler?.loctext) {
      console.warn(`Localization backend unavailable for ${key}, using fallback`);
      return createResult(false, defaultValue);
    }

    // Call UE backend
    const responseJsonStr = await window.ue.handler.loctext(JSON.stringify(request));
    const response = JSON.parse(responseJsonStr);

    // If backend returned a valid result, use it
    if (response?.success && response?.result) {
      return response;
    }

    // Backend responded but didn't find the text
    console.warn(`Localization key not found: ${key}, using fallback`);
    return createResult(false, defaultValue);

  } catch (error) {
    console.error(`Localization error for ${key}:`, error);
    return createResult(false, defaultValue);
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
 * @throws {Error} Catches and logs any errors from UE backend
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
 */
export const getLocTextArray = async (arr) => {
  const createFallbackArray = () =>
    arr.map(item => ({
      key: item.key,
      table: item.table,
      result: item.defaultValue,
      success: false
    }));

  try {
    // Check if UE backend is available
    if (!window.ue?.handler?.loctextarr) {
      console.warn('Localization array backend unavailable, using fallback');
      return createFallbackArray();
    }

    // Prepare request array (without defaultValue for backend)
    const request = arr.map(item => ({
      key: item.key,
      table: item.table
    }));

    // Call UE backend
    const responseJsonStr = await window.ue.handler.loctextarr(JSON.stringify(request));
    const response = JSON.parse(responseJsonStr);

    // Validate response
    if (!Array.isArray(response) || response.length === 0) {
      console.warn('Invalid response from localization backend, using fallback');
      return createFallbackArray();
    }

    // Merge backend response with default values
    return arr.map((item, index) => {
      const backendResult = response[index];

      // If backend succeeded for this item, use its result
      if (backendResult?.success && backendResult?.result) {
        return {
          key: item.key,
          table: item.table,
          result: backendResult.result,
          success: true
        };
      }

      // Otherwise use default value
      return {
        key: item.key,
        table: item.table,
        result: item.defaultValue,
        success: false
      };
    });

  } catch (error) {
    console.error('Failed to fetch localization array:', error);
    return createFallbackArray();
  }
};
