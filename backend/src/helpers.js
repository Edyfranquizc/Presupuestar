import { Readable } from "stream"

function bufferAStream(buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
}

export default { bufferAStream }