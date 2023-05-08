import db from "../database/initialize.ts";
import DatabaseSchema from "./schema.ts";

type Account = (DatabaseSchema["accounts"]) extends readonly (infer ElementType)[] ? ElementType : never;

class User {
    static async get(email: string) {
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

    static async createMockUser(email: string) {
        await db.insertOne({
            user: {
                email,
                name: email,
                password: "",
                secret: {
                    uri: ""
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