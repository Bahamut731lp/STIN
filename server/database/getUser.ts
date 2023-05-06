import DATABASE from "../database/initialize.ts";

export default async function getUser(email: string) {
    const query = await DATABASE.findOne((document) => document.user.email === email)

    if (query == null) {
        return ({
            title: `E-mail not found`,
            detail: `E-mail "${email}" is not in database.`,
            status: 404,
            data: null
        });
    }

    return ({
        title: `E-mail successfully found`,
        detail: `E-mail "${email}" is in database.`,
        data: query,
        status: 200
    })
}