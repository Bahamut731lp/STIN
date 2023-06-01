import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import User from "../../database/user.ts";
import Headers from "../../database/headers.ts";
import getConversion from "../../lib/getConversion.ts";
import getOverdraft from "../../lib/getOverdraft.ts";

interface ExpectedBodyInterface {
    currency: string;
    amount: number;
    prefix: string;
}

export async function post(context: Context) {
    const body = await context.request.body().value;
    const credentials = Headers.getAuthorization(context.request.headers.get("authorization"))
    const { currency, amount } = body as Partial<ExpectedBodyInterface>;

    if (!credentials || !currency || !amount) {
        context.response.status = 400
        context.response.body = {
            data: null
        };
        return;
    }

    const user = await User.get(credentials.email)
    if (!user) {
        context.response.status = 500
        context.response.body = {
            title: "No user found",
            status: 500,
            data: null
        };
        return;
    }

    const accountWithTargetCurrency = user.accounts.find((acc) => acc.currency == currency);
    const defaultAccount = user.accounts.find((acc) => acc.currency == "CZK");
    const accountQueue = [accountWithTargetCurrency, defaultAccount];

    // Na pořadí účtů tady záleží - první účet, kterým půjde zaplatit, použijeme
    for (const account of accountQueue) {
        if (!account) continue;

        let paymentToBeMade = amount;
        const conversion = await getConversion(currency, account.currency, amount);
        const overdraft = Math.max(0, getOverdraft(account.amount));
        
        console.log(account, amount, overdraft);
        if (account.currency != currency) paymentToBeMade = conversion?.result ?? paymentToBeMade;
        if (!conversion) continue;
        if (paymentToBeMade > overdraft) continue;
        if (amount > account.amount) paymentToBeMade -= (account.amount - paymentToBeMade) * 0.1;


        User.updateAccountWithPrefix(credentials.email, account.identifier.prefix, (document) => {
            document.amount -= Math.abs(paymentToBeMade);
            document.history.push({
                type: "payment",
                amount: amount,
                date: new Date().toISOString(),
                conversion: {
                    from: currency,
                    to: account.currency,
                    rate: conversion.result / amount
                }
            })
    
            return document;
        });
    
        context.response.status = 200
        context.response.body = {
            data: "ok",
            status: 200
        };
    
        return;
    }

    context.response.status = 403
    context.response.body = {
        title: "Error",
        status: 500,
        data: null
    };

    return;
}