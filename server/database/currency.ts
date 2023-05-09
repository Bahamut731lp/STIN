import rates from "../database/exchange.ts";
import updateRates from "./updateRates.ts";

class Currency {
    static async getList() {
        await updateRates();
        return (await rates.findMany(() => true)).map(v => v.kod)
    }

    static async get(code: string) {
        await updateRates();
        return rates.findOne((document) => document.kod == code)
    }
}

export default Currency;