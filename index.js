/* jshint node: true */
'use strict';

/**
  # Ratchet - CSS3 Transform Parser

  Ratchet assists with the process of dissecting CSS3 transform strings into
  javascript objects that you can then do something more intelligent with.

  ## Example Usage

  Displayed below is a simple example.  First a html file with a div element
  styled to look like a square box:

  <<< examples/simple.html

  And then some JS that can be used to manipulate the transform of the box (
  in partnership with the [feature](https://github.com/DamonOehlman/feature)
  module):

  <<< examples/simple.js

  If you want to give this a go you should be able to run the example with
  [bde](https://github.com/DamonOehlman/bde) or
  [beefy](https://github.com/chrisdickinson/beefy) with some simple
  modification.  If it works, you will see a square red box, moving
  and rotating towards the right of the screen.

  ## Reference

  To be completed.

**/

var RatchetTransform = require('./types/transform');
var XYZ = require('./types/xyz');
var matchers = require('./matchers');

var unitTypes = {
  translate: 'px',
  rotate: 'deg',
  scale: ''
};

function fromString(inputString) {
  var props = new RatchetTransform();
  var data;

  function checkMatch(rule) {
    // reset the test string to the input string
    var testString = inputString;

    // get the initial match
    var match = rule.regex.exec(testString);

    while (match) {
      // ensure data has been initialized
      data = data || {};

      if (typeof rule.extract == 'function') {
        rule.extract(match, data);
      }
      else {
        for (var section in rule) {
          if (section !== 'regex' && typeof rule[section] == 'function') {
            data[section] = rule[section](match);
          }
        }
      }

      // update the data units
      data.units = unitTypes[key];

      // remove the match component from the input string
      testString = testString.slice(0, match.index) +
        testString.slice(match.index + match[0].length);

      // if this is a multimatch rule, then run the regex again
      if (rule.multi) {
        match = rule.regex.exec(testString);
      }
      // otherwise, clear the match to break the loop
      else {
        match = null;
      }
    }

    // initialise the properties (if we have data)
    if (data) {
      props[key] = new XYZ(key, data);

      // reset the data
      data = undefined;
    }
  }

  // iterate through the parsers
  for (var key in matchers) {
    matchers[key].forEach(checkMatch);
  }

  return props;
}

var ratchet = module.exports = function(input) {
  if (typeof input == 'string' || (input instanceof String)) {
    return fromString(input);
  }
};

// bind the internal helpers so we can test
ratchet.fromString = fromString;
ratchet.Transform = RatchetTransform;
ratchet.XYZ = XYZ;