import db from "../database/sessions.ts";
import {ISession} from "./sessions.ts";

class Session {
    static async get(email: string) {
        return await db.findOne((document) => document.email == email)
    }

    static async create(email: string) {
        await db.insertOne({
            email: email,
            token: undefined,
            expiration: undefined
        })
    }

    static async update(email: string, updater: (value:ISession) => ISession) {
        const session = await Session.get(email);
        if (!session) return false;

        await db.updateOne(
            (document) => document.email == email,
            (document) => updater(document));

        return true;
    }

    static async createMockSession(email: string, token: string) {
        await db.insertOne({
            email,
            token,
            expiration: undefined
        });

        return () => db.deleteOne((document) => document.email == email);
    }
}

export default Session;