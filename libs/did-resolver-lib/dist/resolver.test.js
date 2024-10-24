'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const globals_1 = require('@jest/globals');
const resolver_1 = __importDefault(require('./resolver'));
(0, globals_1.describe)('sum module', () => {
  (0, globals_1.test)('test did peer resolver', () => {
    (0, globals_1.expect)(
      new resolver_1.default()
        .resolve(
          'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
        )
        .then((result) => console.log(result)),
    ).not.toBeNull;
  });
});
