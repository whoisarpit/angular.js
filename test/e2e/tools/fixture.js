'use strict';

var fs = require('fs');
var path = require('path');
var $ = require('cheerio');
var util = require('./util');

var root = path.resolve(__dirname, '..');
var fixtures = path.resolve(root, 'fixtures');

var projectRoot = path.resolve(__dirname, '../../..');
var build = path.resolve(projectRoot, 'build');

function rewriteAngularSrc(src, query) {
  // ... existing code ...
}

function isValidTestPath(test) {
  // Check if the test path is a valid filename and does not contain any path traversal characters
  return typeof test === 'string' && !test.includes('..') && !test.includes('/') && !test.includes('\\');
}

function generateFixture(test, query) {
  if (!isValidTestPath(test)) {
    throw new Error('Invalid test path provided');
  }

  var indexFile = path.resolve(fixtures, test, 'index.html');
  var text = fs.readFileSync(indexFile, 'utf8');

  // ... existing code ...

  var $$ = $.load(text);

  var firstScript = null;
  var jquery = null;
  var angular = null;
  $$('script').each(function(i, script) {
    var src = $(script).attr('src');
    if (src === 'jquery.js' && jquery === null) jquery = script;
    else if (src === 'angular.js' && angular === null) angular = script;
    if (firstScript === null) firstScript = script;
    if (src) {
      // Ensure the path is valid and does not lead to path traversal
      if (!isValidTestPath(src)) {
        throw new Error('Invalid script source path');
      }
      var resolvedPath = path.resolve(build, src);
      var s = util.stat(resolvedPath);
      if (s && s.isFile()) {
        $(script).attr('src', rewriteAngularSrc(src, query));
      } else {
        $(script).attr('src', util.rewriteTestFile(test, src));
      }
    }
  });

  if (!('jquery' in query) || (/^(0|no|false|off|n)$/i).test(query.jquery)) {
    if (jquery) {
      $(jquery).remove();
    }
  } else {
    if (!jquery) {
      jquery = $.load('<script></script>')('script')[0];
      if (firstScript) {
        $(firstScript).before(jquery);
      } else {
        var head = $$('head');
        if (head.length) {
          head.prepend(jquery);
        } else {
          $$.root().first().before(jquery);
        }
      }
    }
    if (!/^\d+\.\d+.*$/.test(query.jquery)) {
      $(jquery).attr('src', '/node_modules/jquery/dist/jquery.js');
    } else {
      $(jquery).attr('src', '//ajax.googleapis.com/ajax/libs/jquery/' + query.jquery + '/jquery.js');
    }
  }

  return $$.html();
}

module.exports = {
  generate: generateFixture
};