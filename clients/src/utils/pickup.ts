import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message, PackEncryptedOptions, UnpackOptions } from 'didcomm';

const MEDIATOR_DID = process.env.MEDIATOR_DID || "did:web:alice-mediator.com:alice_mediator_pub";
const ALICE_DID = process.env.ALICE_DID || "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM";
const PICKUP_DELIVERY_3_0 = "https://didcomm.org/pickup-delivery/3.0";
const PICKUP_RECEIVE_3_0 = "https://didcomm.org/pickup-receive/3.0";
const MEDIATION_ENDPOINT = process.env.MEDIATION_ENDPOINT || "http://localhost:3000/mediate";

const didResolver: string = "";
const secretsResolver: string = "";

async function buildPickupDeliveryRequestMessage(recipientDid: string): Promise<Message> {
    return new Message({
        id: `urn:uuid:${uuidv4()}`,
        typ: "application/didcomm-plain+json",
        type: PICKUP_DELIVERY_3_0,
        from: ALICE_DID,
        to: [MEDIATOR_DID],
        body: {
            recipient_did: recipientDid,
        },
        return_route: "all",
    });
}

async function sendPickupDeliveryRequest(recipientDid: string): Promise<void> {
    try {
        const msg = await buildPickupDeliveryRequestMessage(recipientDid);

        // Pack the message
        const options: PackEncryptedOptions = {};
        const [encryptedMsg] = await msg.pack_encrypted(
            MEDIATOR_DID,
            ALICE_DID,
            null,
            didResolver,
            secretsResolver,
            options
        );

        // Send the message
        const response = await axios.post(MEDIATION_ENDPOINT, encryptedMsg, {
            headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
        });

        console.log("Pickup Delivery Request Response:", response.data);

        // Unpack the response
        const unpackOptions: UnpackOptions = {};
        const packedMsg = response.data as string;
        const [unpackedMsg] = await Message.unpack(
            packedMsg,
            didResolver,
            secretsResolver,
            unpackOptions
        );

        // Log the unpacked message
        console.log("Unpacked Message:", JSON.stringify(unpackedMsg, null, 2));

        // Accessing the body safely
        const body = unpackedMsg.as_value().body;
        if (body .attachments) {
            for (const attachment of body.attachments) {
                const message = JSON.stringify(attachment.data);
                const unpackedAttachment = await Message.unpack(
                    message,
                    didResolver,
                    secretsResolver,
                    unpackOptions
                );
                console.log("\nPickup Delivery Message\n", unpackedAttachment);
            }
        }
    } catch (error: any) {
        console.error("Error during pickup delivery request:", error);
    }
}

async function buildPickupMessageReceivedMessage(messageIds: string[]): Promise<Message> {
    return new Message({
        id: `urn:uuid:${uuidv4()}`,
        typ: "application/didcomm-plain+json",
        type: PICKUP_RECEIVE_3_0,
        from: ALICE_DID,
        to: [MEDIATOR_DID],
        body: {
            message_id_list: messageIds,
        },
        return_route: "all",
    });
}

async function sendPickupMessageReceived(messageIds: string[]): Promise<void> {
    try {
        const msg = await buildPickupMessageReceivedMessage(messageIds);

        // Pack the message
        const options: PackEncryptedOptions = { forward: false };
        const [encryptedMsg] = await msg.pack_encrypted(
            MEDIATOR_DID,
            ALICE_DID,
            null,
            didResolver,
            secretsResolver,
            options
        );

        // Send the message
        const response = await axios.post(MEDIATION_ENDPOINT, encryptedMsg, {
            headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
        });

        // Unpack the response
        const unpackOptions: UnpackOptions = {};
        const packedMsg = response.data as string; // Cast to string here
        const [unpackedMsg] = await Message.unpack(
            packedMsg,
            didResolver,
            secretsResolver,
            unpackOptions
        );

        console.log("\nMessage Received\n", unpackedMsg);
    } catch (error: any) {
        console.error("Error during pickup message received:", error);
    }
}

// Example usage
const recipientDid = "did:key:z6MkfyTREjTxQ8hUwSwBPeDHf3uPL3qCjSSuNPwsyMpWUGH7";
sendPickupDeliveryRequest(recipientDid);
sendPickupMessageReceived(["66ec4d76e8aaed777d76acf9", "66ec4d75e8aaed777d76acf8"]);
