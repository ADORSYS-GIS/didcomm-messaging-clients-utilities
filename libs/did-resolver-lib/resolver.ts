import { DIDDoc, DIDResolver, Service, VerificationMethod } from 'didcomm';
import base64url from 'base64url';

type Purpose =
  | 'Assertion'
  | 'Encryption'
  | 'Verification'
  | 'CapabilityDelegation'
  | 'CapabilityInvocation'
  | 'Service';

export default class PeerDIDResolver implements DIDResolver {
  async resolve(did: string): Promise<DIDDoc | null> {
    try {
      // Validate if the DID starts with the "did:peer:" prefix
      if (!did.startsWith('did:peer:')) {
        throw new Error('Unsupported DID method');
      }

      // Dissect the DID address
      const chain = did
        .replace(/^did:peer:2\./, '')
        .split('.')
        .map((e) => {
          const purposeCode = e.charAt(0);
          const purpose = mapPurposeFromCode(purposeCode);
          const multikey = e.slice(1);
          return { purpose, multikey };
        });

      const authentication: string[] = [];
      const keyAgreement: string[] = [];
      const verificationMethods: VerificationMethod[] = [];

      chain
        .filter(({ purpose }) => purpose !== 'Service')
        .forEach((item, index) => {
          const id = `#key-${index + 1}`;
          const { purpose, multikey } = item;

          switch (purpose) {
            case 'Assertion':
            case 'Verification':
              authentication.push(id);
              break;
            case 'Encryption':
              keyAgreement.push(id);
              break;
          }

          const method: VerificationMethod = {
            id,
            type: 'Ed25519VerificationKey2018',
            controller: did,
            publicKeyMultibase: `z${multikey}`,
          };

          verificationMethods.push(method);
        });

      // Resolve services
      const services: Service[] = [];
      let serviceNextId = 0;

      chain
        .filter(({ purpose }) => purpose === 'Service')
        .forEach(({ multikey }) => {
          const decodedService = base64url.decode(multikey);
          const service = reverseAbbreviateService(decodedService);

          if (!service.id) {
            service.id =
              serviceNextId === 0 ? '#service' : `#service-${serviceNextId}`;
            serviceNextId++;
          }

          services.push(service);
        });

      const diddoc: DIDDoc = {
        id: did,
        keyAgreement,
        authentication,
        verificationMethod: verificationMethods,
        service: services,
      };

      return diddoc;
    } catch (error) {
      console.error('Error resolving DID:', error);
      return null;
    }
  }
}

function reverseAbbreviateService(decodedService: string): Service {
  return {
    id: '',
    type: 'SomeServiceType',
    serviceEndpoint: decodedService,
  };
}
function mapPurposeFromCode(code: string): Purpose {
  switch (code) {
    case 'A':
      return 'Assertion';
    case 'E':
      return 'Encryption';
    case 'V':
      return 'Verification';
    case 'D':
      return 'CapabilityDelegation';
    case 'I':
      return 'CapabilityInvocation';
    case 'S':
      return 'Service';
    default:
      throw new Error('Invalid purpose prefix');
  }
}
