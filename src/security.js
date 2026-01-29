/**
 * IXIMI Legacy - Security Module
 * Advanced security functions for blockchain certification system
 */

const crypto = require('crypto');

// JWT token generation and validation
class TokenManager {
  constructor(secret) {
    this.secret = secret || 'iximi-legacy-secure-token-key';
  }
  
  generateToken(payload, expiresIn = '7d') {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const expiration = new Date();
    if (expiresIn.endsWith('d')) {
      expiration.setDate(expiration.getDate() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('h')) {
      expiration.setHours(expiration.getHours() + parseInt(expiresIn));
    }
    
    const data = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiration.getTime() / 1000)
    };
    
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
    
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${encodedHeader}.${encodedData}`)
      .digest('base64');
    
    return `${encodedHeader}.${encodedData}.${signature}`;
  }
  
  verifyToken(token) {
    try {
      const [encodedHeader, encodedData, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${encodedHeader}.${encodedData}`)
        .digest('base64');
      
      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }
      
      const data = JSON.parse(Buffer.from(encodedData, 'base64').toString());
      
      if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token expired' };
      }
      
      return { valid: true, data };
      
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Input validation and sanitization
class InputValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  static sanitizeText(text, maxLength = 1000) {
    if (typeof text !== 'string') return '';
    
    return text
      .replace(/[<>"'&]/g, '') // Remove dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength);
  }
  
  static validateTextileMetadata(metadata) {
    const required = ['title', 'description', 'technique', 'creationDate'];
    const errors = [];
    
    required.forEach(field => {
      if (!metadata[field] || metadata[field].trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    if (metadata.title && metadata.title.length > 200) {
      errors.push('Title too long (max 200 characters)');
    }
    
    if (metadata.description && metadata.description.length > 2000) {
      errors.push('Description too long (max 2000 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Rate limiting for API protection
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs || 15 * 60 * 1000; // 15 minutes default
    this.maxRequests = maxRequests || 100; // 100 requests default
    this.requests = new Map();
  }
  
  check(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    for (const [key, timestamp] of this.requests.entries()) {
      if (timestamp < windowStart) {
        this.requests.delete(key);
      }
    }
    
    // Count requests in current window
    const userRequests = Array.from(this.requests.entries())
      .filter(([key, timestamp]) => 
        key.startsWith(identifier) && timestamp > windowStart
      );
    
    if (userRequests.length >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        reset: Math.ceil((userRequests[0][1] + this.windowMs - now) / 1000)
      };
    }
    
    // Record new request
    const requestKey = `${identifier}_${now}`;
    this.requests.set(requestKey, now);
    
    return {
      allowed: true,
      remaining: this.maxRequests - userRequests.length - 1,
      reset: Math.ceil(this.windowMs / 1000)
    };
  }
}

module.exports = {
  TokenManager,
  InputValidator,
  RateLimiter,
  
  // Initialize function
  initialize: function() {
    console.log('  ✅ Security module initialized');
    
    // Test security functions
    const validator = new InputValidator();
    const testEmail = 'test@example.com';
    
    console.log(`    Email validation test: ${testEmail} = ${validator.validateEmail(testEmail) ? '✅ Valid' : '❌ Invalid'}`);
    
    return true;
  }
};
