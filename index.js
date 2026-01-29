/**
 * 💎 IXIMI Legacy - Main Application Entry Point
 * Blockchain certification for indigenous Mexican textiles
 * 
 * @author Estefanía Pérez Vázquez
 * @email legacyiximi@gmail.com
 * @license MIT
 */

console.log('🚀 IXIMI Legacy - Starting application...');
console.log('📅', new Date().toISOString());
console.log('🌐 https://github.com/legacyiximi-afk/iximi-legacy');
console.log('');

// Application configuration
const config = {
  name: 'IXIMI Legacy',
  version: '0.1.0',
  author: 'Estefanía Pérez Vázquez',
  email: 'legacyiximi@gmail.com',
  mission: 'Blockchain certification for indigenous textiles'
};

// Display configuration
console.log('📊 Application Configuration:');
Object.entries(config).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

console.log('');
console.log('🔒 Security Check:');
try {
  // Security: Validate environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV) {
    console.log('  ✅ Environment detected:', process.env.NODE_ENV);
  } else {
    console.log('  ⚠️  Environment not configured');
  }
  
  // Security: Check for required modules
  const requiredModules = ['fs', 'path', 'crypto'];
  const available = requiredModules.filter(mod => {
    try {
      require(mod);
      return true;
    } catch {
      return false;
    }
  });
  
  console.log(`  ✅ ${available.length}/${requiredModules.length} core modules available`);
  
} catch (error) {
  console.log('  ⚠️  Security check skipped:', error.message);
}

// Application modules
const modules = {
  utils: require('./src/utils'),
  config: require('./src/config'),
  security: require('./src/security')
};

// Main application function
function startApplication() {
  console.log('');
  console.log('🎯 Starting IXIMI Legacy components...');
  
  try {
    // Initialize components
    Object.entries(modules).forEach(([name, module]) => {
      if (module && typeof module.initialize === 'function') {
        console.log(`  🔧 Initializing ${name}...`);
        module.initialize();
      }
    });
    
    console.log('');
    console.log('✅ IXIMI Legacy started successfully!');
    console.log('🎯 Mission: Cultural preservation through blockchain');
    console.log('📞 Contact: legacyiximi@gmail.com');
    
    return true;
    
  } catch (error) {
    console.error('❌ Application startup failed:', error.message);
    return false;
  }
}

// Export for module usage
module.exports = {
  config,
  startApplication,
  utils: modules.utils
};

// Auto-start if run directly
if (require.main === module) {
  const success = startApplication();
  process.exit(success ? 0 : 1);
}
