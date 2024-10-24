'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ExampleSecretsResolver = exports.ExampleDIDResolver = void 0;
class ExampleDIDResolver {
  constructor(diddoc) {
    this.diddoc = diddoc;
  }
  async resolve(did) {
    return this.diddoc.find((ddoc) => ddoc.id === did) || null;
  }
}
exports.ExampleDIDResolver = ExampleDIDResolver;
class ExampleSecretsResolver {
  constructor(knownSecrets) {
    this.knownSecrets = knownSecrets;
  }
  async get_secret(secretId) {
    return this.knownSecrets.find((secret) => secret.id === secretId) || null;
  }
  async find_secrets(secretIds) {
    return secretIds.filter((id) =>
      this.knownSecrets.find((secret) => secret.id === id),
    );
  }
}
exports.ExampleSecretsResolver = ExampleSecretsResolver;
