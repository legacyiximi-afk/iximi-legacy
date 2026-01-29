// Simple test for IXIMI Legacy
const test = require('assert');

describe('IXIMI Legacy Verification', () => {
  it('should have essential files', () => {
    const fs = require('fs');
    const files = ['README.md', 'LICENSE', 'package.json'];
    
    files.forEach(file => {
      test.ok(fs.existsSync(file), `${file} should exist`);
    });
  });
  
  it('should have correct project name', () => {
    const pkg = require('../package.json');
    test.strictEqual(pkg.name, 'iximi-legacy');
  });
  
  it('should have MIT license', () => {
    const pkg = require('../package.json');
    test.strictEqual(pkg.license, 'MIT');
  });
});

console.log('✅ IXIMI Legacy tests completed successfully');
