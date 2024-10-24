import { describe, expect, test } from '@jest/globals';
import PeerDIDResolver from './resolver';

describe('sum module', () => {
  test('test did peer resolver', () => {
    expect(
      new PeerDIDResolver()
        .resolve(
          'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
        )
        .then((result) => console.log(result)),
    ).not.toBeNull();
  });
});
