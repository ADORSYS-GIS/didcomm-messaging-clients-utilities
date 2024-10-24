import { DIDResolver, Message, SecretsResolver } from "didcomm";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import PeerDIDResolver from "./resolver";
import ExampleSecretsResolver from "./Example_resolver";

const FROM = '';
let did_resolver: DIDResolver = new PeerDIDResolver();
let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);


async function forward_msg(to:string[], type: string, body: {}): Promise<string>{
    const msg = new Message({
        id: uuidv4(),
        typ: "application/didcomm-plain+json",
        type: type,
        from: FROM,
        to: to,
        body: body
    })
    
    try{
    const [packed_msg, _packedMetadata] = await msg.pack_encrypted(
        to[0],
        FROM,
        null,
        did_resolver,
        secret_resolver,
        {
            forward: true
        }
    )
    let response = await axios.post("https://mediator-endpoint.com", packed_msg,{
        headers:{
            'Content-type': "application/didcomm-plain+json"
            }
        });
        console.log("Message forwared successfully:", response.status);
    }
        catch (error: any) {
            Error(error)
        }
        return "Messages sent to recipient";
    
    }