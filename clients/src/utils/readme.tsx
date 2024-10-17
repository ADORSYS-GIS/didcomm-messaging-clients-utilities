import { Resolver, DIDResolutionResult, DIDDocument, DIDResolver } from 'did-resolver';

// Helper to decode base64 URL-encoded JSON
function decodeBase64Url(input: string): any {
    const decoded = Buffer.from(input, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
}

// A modified implementation to resolve did:peer v2 DIDs
const resolveDidPeerV2: DIDResolver = async (did: string): Promise<DIDResolutionResult> => {
    try {
        const parsedDID = parseDidPeerV2(did);
        if (!parsedDID) {
            return {
                didResolutionMetadata: { error: 'invalidDid' },
                didDocument: null,
                didDocumentMetadata: {},
            };
        }

        const { publicKey, service, id } = parsedDID;

        // Construct a DID document using the parsed information
        const didDocument: DIDDocument = {
            id: did,
            verificationMethod: [
                {
                    id: `${did}#keys-1`,
                    type: 'Ed25519VerificationKey2018',
                    controller: did,
                    publicKeyMultibase: publicKey,
                },
            ],
            authentication: [
                {
                    id: `${did}#keys-1`,
                    type: 'Ed25519VerificationKey2018',
                    controller: did,
                    publicKeyMultibase: publicKey,
                },
            ],
        };

        // If a service section is present, add it to the DID document
        if (service) {
            didDocument.service = [
                {
                    id: `${did}#service-1`,
                    type: service.type,
                    serviceEndpoint: service.endpoint,
                },
            ];
        }

        return {
            didResolutionMetadata: { contentType: 'application/did+ld+json' },
            didDocument,
            didDocumentMetadata: {},
        };
    } catch (error) {
        return {
            didResolutionMetadata: { error: 'notFound', message: "error.message" },
            didDocument: null,
            didDocumentMetadata: {},
        };
    }
};

// Function to parse did:peer v2 DIDs
function parseDidPeerV2(did: string): { publicKey: string; service?: { type: string; endpoint: string }; id: string } | null {
    const didRegex = /^did:peer:2\.([^.]+)\.([^.]+)\.([^.]+)$/;
    const match = did.match(didRegex);
    if (!match) return null;

    const [, encodedPublicKey, encodedService, encodedMetadata] = match;

    // Decode the public key
    const publicKey = encodedPublicKey;

    // Decode the service, if present
    let service;
    if (encodedService) {
        try {
            const decodedService = decodeBase64Url(encodedService);
            service = {
                type: decodedService.a[0],
                endpoint: decodedService.s,
            };
        } catch (e) {
            console.error('Failed to decode service:', e);
            return null;
        }
    }

    // The id is usually extracted from the metadata, in this case, we assume "#didcomm"
    const id = '#didcomm';

    return {
        publicKey,
        service,
        id,
    };
}

// Configure the DID Resolver with the did:peer v2 resolver
const didResolver = new Resolver({
    'peer': resolveDidPeerV2,
});

// Example usage
export default async function resolvePeerDidV2(did: string) {
    const result = await didResolver.resolve(did);
    if (result.didDocument) {
        console.log('DID Document:', JSON.stringify(result.didDocument, null, 2));
    } else {
        console.error('Resolution error:', result.didResolutionMetadata);
    }
}

// Example DID
const exampleDid = 'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0';
resolvePeerDidV2(exampleDid);
