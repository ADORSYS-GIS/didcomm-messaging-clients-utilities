did-universal-resolver-driver
=============================

Decentralized Identity (DID) Universal Resolver abstract driver class

## Abstract

In this module we provide a base `Driver` class for [Decentralized
Identity (DID)](https://w3c-ccg.github.io/did-spec/) universal
resolution. This driver implements an interface similar to the reference
implementation described in the
[universal-resolver](https://github.com/decentralized-identity/universal-resolver)
repository. Implementors should extend this *abstract class* to describe
their own resolution driver.

## Installation

```sh
$ npm install did-universal-resolver-driver
```

## Usage Example

```js
const { Driver } = require('did-universal-resolver-driver')
const driver = new Driver({
  resolve(identifier) {
    // resolve identifier with ResolutionResult somehow
  },

  properties() {
    // return Map<String, Object> instance of driver resolution properties
  }
})
```

An implementor can extend this base class overloading the required
methods for the driver.


```js
const { Driver } = require('did-universal-resolver-driver')
class MyDriver extends Driver {
  resolve(identifier) {
    // resolve identifier with ResolutionResult somehow
  },

  properties() {
    // return Map<String, Object> instance of driver resolution properties
  }
}
```

## API

### `driver = new Driver(opts)`

where `opts` should be:

```
{
  resolve(identifier): ResolutionResult // Resolve identifier into a ResolutionResult
  properties(): Map<String, Object> // A Map instance of property keys to object values
}
```

#### `driver.resolve(identifier)`

where `identifier` is a DID URI.

An interface method that should be overloaded. Will throw error if not
implemented.

#### `driver.properties()`

An interface method that should be overloaded. Will throw error if not
implemented.

## See Also

* [Decentralized Identity Spec](https://github.com/w3c-ccg/did-spec)
* [Universal Resolver](https://github.com/decentralized-identity/universal-resolver)
* [did-universal-resolver-resolution](https://github.com/littlstar/did-universal-resolver-resolution)

## Licence

MIT
