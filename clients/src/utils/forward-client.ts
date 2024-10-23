import { Message } from "didcomm";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const resolver = new PeerDIDResolver();

export async function sendForwardMessage(){
    const ALICE_DID = "did:peer:recipientDID";

    const recipientDIDDoc = await resolver.resolve(ALICE_DID);

    const BOB_DID = "did:peer:senderDID";
    const senderDIDDoc = await resolver.resolve(BOB_DID);

    const msg = new Message({
        id:uuidv4(),
        typ: "application/didcomm-encrypted+json"
        type:"https://didcomm.org/routing/2.0/forward",
        from: BOB_DID,
        to: [ALICE_DID],
        body: {message: "hey there"},
    });

    const didcomm = new didcomm();
    const encryptedMessage = await didcomm.pack_encrypted({
        message: msg,
        to: ALICE_DID,
        from: BOB_DID,
    });
    
    const forwardMessage = new Message({
        id: uuidv4(),
        typ: "application/didcomm-encrypted+json"
        type: "https://didcomm.org/routing/2.0/forward",
        to:["did:peer:mediatorDID"],
        body: encryptedMessage
    });

    const response = await axios.post("https://mediator-endpoint.com", forwardMessage,{
        headers:{
            'Content-type': "application/didcomm-encrypted+json"
        }
    });
    console.log("Message forwared successfully:", response.status);
}