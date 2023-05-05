export default function require(body: Record<string, unknown>, ...fields: string[]) {
    for (const field of fields) {
        if (!(field in body)) {
            return {
                title: `No ${field} provided`,
                detail: `This application requries "${field}" to be provided in the request's body.`,
                status: 400
            }
        }
    }

    return {
        title: `Everything is ok`,
        detail: `Request body has all the required fields (${JSON.stringify(fields)})`,
        status: 200
    }
}