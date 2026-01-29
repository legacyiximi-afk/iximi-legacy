/**
 * IXIMI Legacy - Configuration Management
 * Environment-based configuration with security defaults
 */

// Default configuration (development)
const defaultConfig = {
  // Application
  appName: 'IXIMI Legacy',
  appVersion: '0.1.0',
  environment: process.env.NODE_ENV || 'development',
  
  // API
  apiPort: process.env.PORT || 3000,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  corsOrigins: ['http://localhost:5173', 'https://iximilegacy.org'],
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/iximi_legacy',
    poolSize: 10,
    timeout: 5000
  },
  
  // Blockchain
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'polygon',
    rpcUrl: process.env.RPC_URL || 'https://polygon-rpc.com',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    gasLimit: 500000
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: '7d',
    bcryptRounds: 10,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // Cultural preservation settings
  cultural: {
    supportedLanguages: ['es', 'en', 'zap', 'mix'],
    defaultLanguage: 'es',
    preserveAudioNarratives: true,
    communityValidationRequired: true
  }
};

// Production configuration overrides
const productionConfig = {
  environment: 'production',
  security: {
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: 12
  },
  database: {
    poolSize: 20,
    timeout: 10000
  }
};

// Get current configuration
function getConfig() {
  const baseConfig = { ...defaultConfig };
  
  if (baseConfig.environment === 'production') {
    Object.assign(baseConfig, productionConfig);
  }
  
  // Validate required production environment variables
  if (baseConfig.environment === 'production') {
    const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
  
  return Object.freeze(baseConfig); // Prevent modification
}

// Configuration validation
function validateConfig(config) {
  const errors = [];
  
  if (!config.appName) errors.push('appName is required');
  if (!config.database.url) errors.push('database.url is required');
  if (config.security.jwtSecret === 'dev-secret-change-in-production' && config.environment === 'production') {
    errors.push('JWT_SECRET must be changed in production');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  getConfig,
  validateConfig,
  
  // Initialize function
  initialize: function() {
    const config = getConfig();
    const validation = validateConfig(config);
    
    if (validation.isValid) {
      console.log(`  ✅ Configuration loaded (${config.environment})`);
      return true;
    } else {
      console.error('  ❌ Configuration errors:', validation.errors);
      return false;
    }
  }
};
