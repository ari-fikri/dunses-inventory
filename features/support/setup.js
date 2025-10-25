const { JSDOM } = require('jsdom');
const requireHacker = require('require-hacker');
const expect = require('expect'); // Correctly import the default export
const jestDOMMatchers = require('@testing-library/jest-dom/matchers');

// Extend expect with the DOM matchers
expect.extend(jestDOMMatchers);

// --- JSDOM Setup ---
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
copyProps(window, global);

// --- Global `expect` ---
// Make the extended expect object available globally
global.expect = expect;

// --- Mock Imports ---
// Mock file imports to prevent errors in the Node environment
requireHacker.hook('css', () => 'module.exports = ""');
requireHacker.hook('svg', () => 'module.exports = ""');
requireHacker.hook('png', () => 'module.exports = ""');
requireHacker.hook('jpg', () => 'module.exports = ""');
requireHacker.hook('jpeg', () => 'module.exports = ""');
requireHacker.hook('gif', () => 'module.exports = ""');