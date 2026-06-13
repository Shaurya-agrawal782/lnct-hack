const crypto = require('crypto');

/**
 * Generates a human-readable, unique-like group number: GRP-YYYYMMDD-XXXXX
 * where XXXXX is a random 5-digit number.
 * @returns {string}
 */
const generateGroupNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate random 5-digit integer [10000, 99999]
  const randomVal = crypto.randomInt(10000, 100000);

  return `GRP-${dateStr}-${randomVal}`;
};

module.exports = generateGroupNumber;
