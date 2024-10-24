"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base64url_1 = __importDefault(require("base64url"));
class PeerDIDResolver {
    async resolve(did) {
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
            const authentication = [];
            const keyAgreement = [];
            const verificationMethods = [];
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
                const method = {
                    id,
                    type: 'Ed25519VerificationKey2018',
                    controller: did,
                    publicKeyMultibase: `z${multikey}`,
                };
                verificationMethods.push(method);
            });
            // Resolve services
            const services = [];
            let serviceNextId = 0;
            chain
                .filter(({ purpose }) => purpose === 'Service')
                .forEach(({ multikey }) => {
                const decodedService = base64url_1.default.decode(multikey);
                const service = reverseAbbreviateService(decodedService);
                if (!service.id) {
                    service.id =
                        serviceNextId === 0 ? '#service' : `#service-${serviceNextId}`;
                    serviceNextId++;
                }
                services.push(service);
            });
            const diddoc = {
                id: did,
                keyAgreement,
                authentication,
                verificationMethod: verificationMethods,
                service: services,
            };
            return diddoc;
        }
        catch (error) {
            console.error('Error resolving DID:', error);
            return null;
        }
    }
}
exports.default = PeerDIDResolver;
function reverseAbbreviateService(decodedService) {
    return {
        id: '',
        type: 'SomeServiceType',
        serviceEndpoint: decodedService,
    };
}
function mapPurposeFromCode(code) {
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
