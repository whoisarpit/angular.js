'use strict';

var supportTests = {
  classes: function() {
    try {
      new Function('class C {};'); // Try to create a class using the Function constructor
      return true;
    } catch (e) {
      return false;
    }
  },
  fatArrows: function() {
    try {
      new Function('return (a => a);'); // Try to create an arrow function
      return true;
    } catch (e) {
      return false;
    }
  },
  shorthandMethods: function() {
    try {
      new Function('return ({ fn(x) { return; } });'); // Try to create an object with shorthand method syntax
      return true;
    } catch (e) {
      return false;
    }
  }
};

var support = {};

for (var prop in supportTests) {
  if (supportTests.hasOwnProperty(prop)) {
    try {
      // Call the function associated with each property
      support[prop] = !!supportTests[prop]();
    } catch (e) {
      support[prop] = false;
    }
  }
}