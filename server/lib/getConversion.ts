import rates from "../database/exchange.ts";

export default async function getConversion(from: string, to: string, amount: number) {
    const relevantRates = await rates.findMany((document) => [from, to].includes(document.kod));
    //TODO Test: Nenalezené měny a co s tim
    
    const dictionary = Object.fromEntries(relevantRates.map((rate) => [rate.kod, rate]));
    const amountInCZK = dictionary["from"].kurz * amount;
    const amountInTarget = Math.round(amountInCZK / dictionary["to"].kurz);
    
    return {
        from,
        to,
        result: amountInTarget
    }
}