import { IMessage, Message } from "didcomm";
import { v4 as uuidv4 } from 'uuid';
import PeerDIDResolver from "./resolver";
import { DIDResolver, SecretsResolver } from "didcomm";
import ExampleSecretsResolver from "./Example_resolver";

const From = '';
type routing_did = string;
export default async function Mediation_Coordinaton(anonymous: boolean, to: string[], recipient_did: string, action: string): Promise<routing_did | undefined> {
    let mediation_response: Message = await mediate_request(to, recipient_did);
    let body = mediation_response.as_value().body;
    try {
        let routing_did: string = body["routing_did"];
        keylist_update(recipient_did, action, to)
        return routing_did
    } catch {
        Error("Mediation Deny")
    }

}

async function build_and_pack_msg(to: string[], type: string, body: {}): Promise<string> {
    const msg = new Message({
        id: uuidv4(),
        typ: "application/didcomm-plain+json",
        type: type,
        from: From,
        to: to,
        body: body

    })
    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    const [packed_msg, packedMetadata] = await msg.pack_encrypted(
        to[0],
        From,
        null,
        did_resolver,
        secret_resolver,
        {
            forward: false
        }
    )
    return packed_msg
}

async function mediate_request(to: string[], recipient_did: string): Promise<Message> {
    let body = { "recipient_did": recipient_did }
    let type = "https://didcomm.org/coordinate-mediation/2.0/mediate-request";
    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let packed_msg = build_and_pack_msg(to, type, body);

    let data = fetch('', {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg
}
async function keylist_update(recipient_did: string, action: string, to: string[]) {

    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let type: string = "https://didcomm.org/coordinate-mediation/2.0/keylist-update";
    let body = {
        "updates": [
            {
                "recipient_did": recipient_did[0],
                "action": action
            }
        ]
    }

    let packed_msg = build_and_pack_msg(to, type, body);

    let data = fetch('', {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg

}

async function keylist_query(recipient_did: string[], action: string, did: string) {

    let type = "https://didcomm.org/coordinate-mediation/2.0/keylist-query";
    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let body = {}
    let packed_msg = build_and_pack_msg(recipient_did, type, body);
    let data = fetch('', {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg


}



















