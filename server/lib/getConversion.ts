import Currency from "../database/currency.ts";

export default async function getConversion(from: string, to: string, amount: number) {
    if (!from || !to || !amount) return null;
    
    const fromRate = await Currency.get(from);
    const toRate = await Currency.get(to);

    if (!fromRate || !toRate) return null;

    const dictionary = Object.fromEntries([["from", fromRate], ["to", toRate]]);
    const amountInCZK = (dictionary["from"].kurz / dictionary["from"].mnozstvi) * amount;
    const amountInTarget = Math.round(amountInCZK * dictionary["to"].mnozstvi / dictionary["to"].kurz);
    
    return {
        from,
        to,
        result: amountInTarget
    }
}