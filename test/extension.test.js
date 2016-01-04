/* global suite, test */

// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
var assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
var vscode = require('vscode');
var vqExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {

	// Defines a Mocha unit test
	test("Got activate function", function() {
		assert.equal('function', typeof vqExtension.activate);
	});
});