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

    static async createMockSession(email: string, token: string, valid = false) {
        await db.insertOne({
            email,
            token,
            expiration: valid ? new Date(new Date().setHours(new Date().getHours() + 4)).toLocaleString() : undefined
        });

        return () => db.deleteOne((document) => document.email == email);
    }

    static async delete(email: string) {
        await db.deleteMany((document) => document.email == email);
    }

    static async isValid(email: string) {
        const session = await Session.get(email);
        if (!session || !session.expiration || !session.token) return false;

        return new Date(session.expiration) > new Date();
    }
}

export default Session;