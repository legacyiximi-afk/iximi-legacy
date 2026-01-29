/**
 * IXIMI Legacy - Utility Functions
 * Secure and efficient utilities for blockchain certification
 */

const crypto = require('crypto');

// Secure hash function for blockchain data
function secureHash(data) {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}

// Validate textile data structure
function validateTextileData(textile) {
  const requiredFields = ['id', 'artisanId', 'creationDate', 'technique'];
  const missingFields = requiredFields.filter(field => !textile[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return {
    isValid: true,
    hash: secureHash(textile),
    timestamp: new Date().toISOString()
  };
}

// Format artisan information
function formatArtisanInfo(artisan) {
  return {
    id: artisan.id || secureHash(artisan.name + artisan.community),
    name: sanitizeInput(artisan.name),
    community: sanitizeInput(artisan.community),
    techniques: Array.isArray(artisan.techniques) ? artisan.techniques : [],
    yearsOfExperience: parseInt(artisan.yearsOfExperience) || 0,
    isVerified: !!artisan.isVerified
  };
}

// Sanitize user input to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 500); // Limit length
}

// Generate unique blockchain ID
function generateBlockchainId(type, data) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const dataHash = secureHash(data);
  
  return `${type}_${timestamp}_${random}_${dataHash.substring(0, 16)}`;
}

module.exports = {
  secureHash,
  validateTextileData,
  formatArtisanInfo,
  sanitizeInput,
  generateBlockchainId,
  
  // Initialize function for application startup
  initialize: function() {
    console.log('  ✅ Utilities module initialized');
    return true;
  }
};
