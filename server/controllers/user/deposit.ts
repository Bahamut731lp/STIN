import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import db from "../../database/initialize.ts";
import getConversion from "../../lib/getConversion.ts";

export async function post(context: Context) {
    const body = await context.request.body().value;
    const [email] = atob(context.request.headers.get("authorization")?.split(/\s+/gi)?.pop() ?? "")?.split(":") ?? [null, null];

    const { currency, amount, prefix } = body;

    if (!currency || !amount || !prefix) {
        context.response.status = 400
        context.response.body = {
            data: null
        };
        return;
    }

    const user = await db.findOne((document) => document.user.email == email);
    if (!user) {
        context.response.status = 500
        context.response.body = {
            data: null
        };
        return;
    }

    const index = user.accounts.findIndex((acc) => acc.identifier.prefix == prefix);
    const conversion = await getConversion(currency, user.accounts[index].currency, amount);

    if (!conversion) {
        context.response.status = 400
        context.response.body = {
            data: null
        };

        return;
    }

    await db.updateOne(
        (document) => document.user.email == email,
        (document) => {
            document.accounts[index].amount += conversion.result;
            document.accounts[index].history.push({
                type: "deposit",
                amount: amount,
                date: new Date().toISOString(),
                conversion: {
                    from: currency,
                    to: user.accounts[index].currency,
                    rate: conversion.result / amount
                }
            })

            return document;
        }
    )

    context.response.status = 200
    context.response.body = {
        data: "ok",
        status: 200
    };

    return;
}