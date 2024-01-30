'use strict';

var fs = require('fs');
var path = require('path');

var root = path.resolve(__dirname, '..');
var tests = path.resolve(root, 'fixtures');

function sanitizeInput(input) {
  // Remove any path traversal characters or sequences
  return input.replace(/(\.\.(\/|\\|$))+/, '');
}

function stat(resolvedPath) {
  try {
    return fs.statSync(resolvedPath);
  } catch (e) {
    // Ignore ENOENT.
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

function testExists(testname) {
  testname = sanitizeInput(testname);
  var resolvedPath = path.resolve(tests, testname);
  if (!resolvedPath.startsWith(tests)) {
    throw new Error('Invalid test path');
  }
  var s = stat(resolvedPath);
  return s && s.isDirectory();
}

function rewriteTestFile(testname, testfile) {
  testname = sanitizeInput(testname);
  testfile = sanitizeInput(testfile);

  if (testfile.search(/^https?:\/\//) === 0) {
    return testfile;
  }

  var resolvedPath = path.resolve(tests, testname, testfile);
  if (!resolvedPath.startsWith(path.resolve(tests, testname))) {
    throw new Error('Invalid file path');
  }

  var s = stat(resolvedPath);
  if (s && (s.isFile() || s.isDirectory())) {
    return ['/test/e2e/fixtures', testname, testfile].join('/');
  }
  return false;
}

module.exports = {
  stat: stat,
  testExists: testExists,
  rewriteTestFile: rewriteTestFile
};