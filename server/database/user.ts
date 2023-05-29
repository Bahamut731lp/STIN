import db from "../database/initialize.ts";
import getPasswordHash from "../lib/hash.ts";
import DatabaseSchema from "./schema.ts";

type Account = (DatabaseSchema["accounts"]) extends readonly (infer ElementType)[] ? ElementType : never;

class User {
    static async get(email: string): Promise<DatabaseSchema | null> {
        return await db.findOne((document) => document.user.email == email)
    }

    static async getAccountWithPrefix(email: string, prefix: string) {
        const user = await db.findOne((document) => document.user.email == email);
        if (!user) return null;

        const accountIndex = user.accounts.findIndex((account) => account.identifier.prefix == prefix);
        if (accountIndex < 0) return null;

        return {
            data: user.accounts[accountIndex],
            index: accountIndex
        }
    }

    static async updateAccountWithPrefix(email: string, prefix: string, update: (account: Account) => Account) {
        const account = await User.getAccountWithPrefix(email, prefix);
        if (!account) return false;

        await db.updateOne(
            (document) => document.user.email == email,
            (document) => {
                document.accounts[account.index] = update(account.data);
                return document;
            });

        return true;
    }

    static async getNewAccount(email: string, currency: string) {
        const user = await db.findOne((document) => document.user.email == email);
        if (!user) return false;

        const getPrefixNumber = () => Math.floor(100000 + Math.random() * 900000);
        let prefix: string;
        do {
            prefix = String(getPrefixNumber());
        } while (user.accounts.find((v) => v.identifier.prefix == prefix) != undefined);

        const base = user.accounts[0].identifier.base;

        await db.updateOne(
            (document) => document.user.email == email,
            (document) => {
                document.accounts.push({
                    amount: 0,
                    currency,
                    history: [],
                    identifier: {
                        prefix,
                        base,
                        bank: "0666"
                    }
                });

                return document;
            }
        );

        return true;
    }

    static async createMockUser(email: string, password = "") {
        await db.insertOne({
            user: {
                email,
                name: email,
                password: password ? await getPasswordHash(password) : "",
                secret: {
                    uri: "otpauth://totp/TEST?secret=ORSXG5A=&issuer=TEST"
                }
            },
            accounts: [{
                amount: 1000,
                currency: "CZK",
                history: [],
                identifier: {
                    bank: "0666",
                    base: "",
                    prefix: "000000"
                }
            }]
        })

        return () => User.deleteUser(email);
    }

    static async deleteUser(email: string) {
        await db.deleteOne((document) => document.user.email == email);
    }


}

export default User;