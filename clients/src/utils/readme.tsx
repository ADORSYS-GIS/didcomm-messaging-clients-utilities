import { DIDDoc, DIDResolver } from "didcomm";


export class PeerDIDResolver implements DIDResolver {
    async resolve(did: string): Promise<DIDDoc | null> {
        try {
     
            if (!did.startsWith("did:peer:2")) {
                throw new Error("Unsupported DID method");
            }

            // Parse the did:peer v2 DID
            const parsedDID = this.parseDidPeerV2(did);
            if (!parsedDID) {
                return null;
            }

            const { publicKey, service } = parsedDID;

            // Construct the DID document
            const didDoc: DIDDoc = {
                id: did,
                keyAgreement: [`${did}#keys-1`],
                verificationMethod: [
                    {
                        id: `${did}#keys-1`,
                        type: "Ed25519VerificationKey2018",
                        controller: did,
                        publicKeyMultibase: publicKey,
                    },
                ],
                authentication: [`${did}#keys-1`],
                service: service
                ? [
                      {
                          id: `${did}#service-1`,
                          type: service.type,
                          serviceEndpoint: service.endpoint,
                      },
                  ]
                : [],
            };

            // If service is defined, add it to the DID document
            if (service) {
                didDoc.service = [
                    {
                        id: `${did}#service-1`,
                        type: service.type,
                        serviceEndpoint: service.endpoint,
                    },
                ];
            }

            return didDoc;
        } catch (error: any) {
            if (error.message.includes("Unsupported DID method")) {
                let e = new Error("Unsupported DID method");
                e.name = "DIDCommInvalidState";
                throw e;
            } else {
                let e = new Error("Failed to resolve the DID");
                e.name = "DIDCommMalformed";
                throw e;
            }
        }
    }

    // Function to parse did:peer v2 DIDs
    private parseDidPeerV2(did: string): { publicKey: string; service?: { type: string; endpoint: string } } | null {
        const didRegex = /^did:peer:2\.([^.]+)\.([^.]+)\.([^.]+)$/;
        const match = did.match(didRegex);
        if (!match) return null;

        const [, encodedPublicKey, encodedService] = match;

        // The public key is in the first segment
        const publicKey = encodedPublicKey;

        // Decode the service part
        let service;
        if (encodedService) {
            try {
                const decodedService = JSON.parse(Buffer.from(encodedService, "base64url").toString("utf-8"));
                service = {
                    type: decodedService.a[0],
                    endpoint: decodedService.s,
                };
            } catch (e) {
                return null;
            }
        }

        return {
            publicKey,
            service,
        };
    }
}


export default async function resolveDIDExample() {
    const resolver = new PeerDIDResolver();

    const did = "did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0";

    try {
        const didDoc = await resolver.resolve(did);
       
            console.log("Resolved DID Document:", didDoc);
    
    } catch (error) {
        console.error("Error resolving DID:", error);
    }
}

// Call the example function
resolveDIDExample();
