'use strict';

/** @this */
function $$TestabilityProvider() {
  this.$get = ['$rootScope', '$browser', '$location',
       function($rootScope,   $browser,   $location) {

    /**
     * @name $testability
     *
     * @description
     * The private $$testability service provides a collection of methods for use when debugging
     * or by automated test and debugging tools.
     */
    var testability = {};

    /**
     * @name $$testability#findBindings
     *
     * @description
     * Returns an array of elements that are bound (via ng-bind or {{}})
     * to expressions matching the input.
     *
     * @param {Element} element The element root to search from.
     * @param {string} expression The binding expression to match.
     * @param {boolean} opt_exactMatch If true, only returns exact matches
     *     for the expression. Filters and whitespace are ignored.
     */
    testability.findBindings = function(element, expression, opt_exactMatch) {
      var bindings = element.getElementsByClassName('ng-binding');
      var matches = [];
      forEach(bindings, function(binding) {
        var dataBinding = angular.element(binding).data('$binding');
        if (dataBinding) {
          forEach(dataBinding, function(bindingName) {
            if (opt_exactMatch) {
// Import a library to sanitize the regex if needed
// const recheck = require('recheck');

// Define a hardcoded regex pattern or a safe way to create one from user input
// For example, if `expression` must be a specific set of characters, define a whitelist and validate against it
// const WHITELIST = /^[a-zA-Z0-9]+$/;

// Validate the `expression` before using it in the regex
// if (!WHITELIST.test(expression)) {
//   throw new Error('Invalid expression');
// }

// If using a library like recheck, ensure the expression is safe
// if (!recheck.isSafe(expression)) {
//   throw new Error('Unsafe regular expression');
// }

// Use the validated or sanitized expression in the regex
// Assuming `expression` is now safe to use
var safeExpression = escapeForRegexp(expression); // Make sure escapeForRegexp properly escapes special regex characters
var matcher = new RegExp('(^|\\s)' + safeExpression + '(\\s|\\||$)');

// Continue with the rest of your code
                matches.push(binding);
              }
            } else {
              if (bindingName.indexOf(expression) !== -1) {
                matches.push(binding);
              }
            }
          });
        }
      });
      return matches;
    };

    /**
     * @name $$testability#findModels
     *
     * @description
     * Returns an array of elements that are two-way found via ng-model to
     * expressions matching the input.
     *
     * @param {Element} element The element root to search from.
     * @param {string} expression The model expression to match.
     * @param {boolean} opt_exactMatch If true, only returns exact matches
     *     for the expression.
     */
    testability.findModels = function(element, expression, opt_exactMatch) {
      var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
      for (var p = 0; p < prefixes.length; ++p) {
        var attributeEquals = opt_exactMatch ? '=' : '*=';
        var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
        var elements = element.querySelectorAll(selector);
        if (elements.length) {
          return elements;
        }
      }
    };

    /**
     * @name $$testability#getLocation
     *
     * @description
     * Shortcut for getting the location in a browser agnostic way. Returns
     *     the path, search, and hash. (e.g. /path?a=b#hash)
     */
    testability.getLocation = function() {
      return $location.url();
    };

    /**
     * @name $$testability#setLocation
     *
     * @description
     * Shortcut for navigating to a location without doing a full page reload.
     *
     * @param {string} url The location url (path, search and hash,
     *     e.g. /path?a=b#hash) to go to.
     */
    testability.setLocation = function(url) {
      if (url !== $location.url()) {
        $location.url(url);
        $rootScope.$digest();
      }
    };

    /**
     * @name $$testability#whenStable
     *
     * @description
     * Calls the callback when all pending tasks are completed.
     *
     * Types of tasks waited for include:
     * - Pending timeouts (via {@link $timeout}).
     * - Pending HTTP requests (via {@link $http}).
     * - In-progress route transitions (via {@link $route}).
     * - Pending tasks scheduled via {@link $rootScope#$applyAsync}.
     * - Pending tasks scheduled via {@link $rootScope#$evalAsync}.
     *   These include tasks scheduled via `$evalAsync()` indirectly (such as {@link $q} promises).
     *
     * @param {function} callback
     */
    testability.whenStable = function(callback) {
      $browser.notifyWhenNoOutstandingRequests(callback);
    };

    return testability;
  }];
}