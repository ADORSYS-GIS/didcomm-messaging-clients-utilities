import { Message } from "didcomm";
import { v4 as uuidv4, v4 } from 'uuid';

const FROM: string = ""
export function mediation_request(to: string[]) {

    // build message from sender to receiver
    const msg = new Message({
        id: v4(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/coordinate-mediation/2.0/mediate-request",
        from: FROM,
        to: to,

    })

}