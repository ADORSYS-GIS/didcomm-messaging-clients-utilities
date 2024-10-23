import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'didcomm';

const MEDIATOR_DID = process.env.MEDIATOR_DID || "did:web:alice-mediator.com:alice_mediator_pub";
const ALICE_DID = process.env.ALICE_DID || "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM";
const PICKUP_REQUEST_3_0 = "https://didcomm.org/pickup-request/3.0";
const MEDIATION_ENDPOINT = process.env.MEDIATION_ENDPOINT || "http://localhost:3000/mediate";

// Empty strings for keys and resolvers where needed
const didResolver: string = "";
const secretsResolver: string = "";
async function buildPickupRequestMessage(recipientDid: string): Promise<Message> {
    return new Message({
        id: `urn:uuid:${uuidv4()}`,
        typ: "application/didcomm-plain+json",
        type: PICKUP_REQUEST_3_0,
        from: ALICE_DID,
        to: [recipientDid],
        body: {
            recipient_did: recipientDid
        },
        return_route: "all",
    });
}

async function sendPickupRequest(recipientDid: string): Promise<void> {
    try {
        // Build the message
        const msg = await buildPickupRequestMessage(recipientDid);

        const [encryptedMsg, encryptMetadata] = await msg.pack_encrypted(
            MEDIATOR_DID,
            ALICE_DID,
            null,
            didResolver,
            secretsResolver,
            {
                forward: false,
            }
        );

        console.log("Encryption metadata is\n", encryptMetadata);

        // --- Send message ---
        const response = await axios.post(MEDIATION_ENDPOINT, encryptedMsg, {
            headers: {
                'Content-Type': 'application/didcomm-encrypted+json'
            }
        });

        console.log("Pickup Request Response:", response.data);
    } catch (error: any) {
        console.error("Error during pickup request:", error);
    }
}

// Usage example
const recipientDid: string = "did:key:z6MkfyTREjTxQ8hUwSwBPeDHf3uPL3qCjSSuNPwsyMpWUGH7";
sendPickupRequest(recipientDid);
