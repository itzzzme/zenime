import ISO6391 from 'iso-639-1';

/**
 * Converts a language name to ISO 639-1 code
 * @param {string} label - Language name (e.g., "English", "Spanish")
 * @returns {string} ISO 639-1 code (e.g., "en", "es")
 */
export const getLanguageCode = (label) => {
  if (!label) return 'en';

  // Try exact match
  const code = ISO6391.getCode(label);
  if (code) return code;

  // Try normalized match (capitalize first letter)
  const normalized = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  const normalizedCode = ISO6391.getCode(normalized);
  if (normalizedCode) return normalizedCode;

  // Try partial match for complex labels like "English (US)" or case variations
  const allCodes = ISO6391.getAllCodes();
  const lowerLabel = label.toLowerCase();

  for (const langCode of allCodes) {
    const langName = ISO6391.getName(langCode).toLowerCase();
    if (lowerLabel.includes(langName) || langName.includes(lowerLabel)) {
      return langCode;
    }
  }

  // Fallback: use first 2 characters
  return lowerLabel.slice(0, 2);
};

/**
 * Validates if a string is a valid ISO 639-1 code
 * @param {string} code - Language code to validate
 * @returns {boolean}
 */
export const isValidLanguageCode = (code) => {
  return ISO6391.validate(code);
};

/**
 * Gets all supported language codes
 * @returns {Array<string>} Array of ISO 639-1 codes
 */
export const getAllLanguageCodes = () => {
  return ISO6391.getAllCodes();
};

/**
 * Gets the language name from code
 * @param {string} code - ISO 639-1 code
 * @returns {string} Language name
 */
export const getLanguageName = (code) => {
  return ISO6391.getName(code) || code;
};
