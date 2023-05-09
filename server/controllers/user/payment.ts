import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import User from "../../database/user.ts";
import Headers from "../../database/headers.ts";
import getConversion from "../../lib/getConversion.ts";

interface ExpectedBodyInterface {
    currency: string;
    amount: number;
    prefix: string;
}

export async function post(context: Context) {
    const body = await context.request.body().value;
    const credentials = Headers.getAuthorization(context.request.headers.get("authorization"))
    const { currency, amount, prefix } = body as Partial<ExpectedBodyInterface>;

    if (!credentials || !currency || !amount || !prefix) {
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

    const account = await User.getAccountWithPrefix(credentials.email, prefix);
    if (!account) {
        context.response.status = 400
        context.response.body = {
            title: "Account does not exist",
            status: 400,
            data: null
        };
        return;
    }

    const conversion = await getConversion(currency, account.data.currency, amount);
    if (!conversion) {
        context.response.status = 400
        context.response.body = {
            title: "Conversion failed",
            status: 400,
            data: null
        };

        return;
    }

    if (account.data.amount < conversion.result) {
        context.response.status = 403
        context.response.body = {
            title: "Not enough balance",
            status: 403,
            data: null
        };
        return;
    }


    User.updateAccountWithPrefix(credentials.email, prefix, (document) => {
        document.amount -= conversion.result;
        document.history.push({
            type: "payment",
            amount: amount,
            date: new Date().toISOString(),
            conversion: {
                from: currency,
                to: user.accounts[account.index].currency,
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