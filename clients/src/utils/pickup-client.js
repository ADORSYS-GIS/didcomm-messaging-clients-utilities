const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

const MEDIATOR_DID = process.env.MEDIATOR_DID || "did:web:alice-mediator.com:alice_mediator_pub";
const ALICE_DID = process.env.ALICE_DID || "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM";
const PICKUP_REQUEST_3_0 = "https://didcomm.org/pickup-request/3.0";
const MEDIATION_ENDPOINT = process.env.MEDIATION_ENDPOINT || "http://localhost:3000/mediate";

async function buildPickupRequestMessage(recipientDid) {
    return {
        id: `urn:uuid:${uuidv4()}`,
        type: PICKUP_REQUEST_3_0,
        body: {
            recipient_did: recipientDid
        },
        return_route: "all",
        to: MEDIATOR_DID,
        from: ALICE_DID
    };
}

async function testPickupRequest() {
    const msg = await buildPickupRequestMessage("did:key:z6MkfyTREjTxQ8hUwSwBPeDHf3uPL3qCjSSuNPwsyMpWUGH7");

    try {
        const response = await axios.post(MEDIATION_ENDPOINT, msg, {
            headers: {
                'Content-Type': 'application/didcomm-encrypted+json'
            }
        });

        console.log("Pickup Request Response:", response.data);
    } catch (error) {
        console.error("Error sending pickup request:", error.response ? error.response.data : error.message);
    }
}
testPickupRequest();
