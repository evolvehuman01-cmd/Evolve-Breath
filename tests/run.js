var assert = require('assert');
var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  ✓ ' + name);
    passed++;
  } catch(e) {
    console.log('  ✗ ' + name);
    console.log('    ' + (e.message || String(e)));
    failed++;
  }
}

function suite(name, fn) {
  console.log('\n' + name);
  fn();
}

require('./utils.test.js')(test, suite, assert);
require('./integrity.test.js')(test, suite, assert);

console.log('\n' + (failed ? failed + ' failed' : 'all tests passed') + ', ' + passed + ' passed\n');
if(failed) process.exit(1);
