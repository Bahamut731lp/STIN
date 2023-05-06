import { Dialog } from "@headlessui/react";
import { useState, useContext } from "react";

import Account from "../interface/Account";
import Transaction, { TransactionType } from "../interface/Transaction";

import Modal, { ModalProps } from "./Modal";
import AccountSelector from "./AccountSelector";
import { MiniBanknotes, MiniMinus, MiniPlus, XMark } from "./Icons";
import getCurrencyFormatter from "../lib/CurrencyFormatter";

interface AccountHistoryModalProps extends Pick<ModalProps, "isOpen" | "setIsOpen"> {
    accounts: Account[]
    active: string
}

export default function AccountHistoryModal(props: AccountHistoryModalProps) {

    const data: Transaction[] = [
        {
            amount: 10000,
            currency: "CZK",
            type: "deposit",
            date: new Date()
        },
        {
            amount: 100,
            currency: "EUR",
            type: "payment",
            converted: 2500,
            date: new Date()
        },
        {
            amount: 10000,
            currency: "EUR",
            type: "withdraw",
            date: new Date()
        },
        {
            amount: 10000,
            currency: "CZK",
            type: "deposit",
            date: new Date()
        },
        {
            amount: 100,
            currency: "EUR",
            type: "payment",
            converted: 2500,
            date: new Date()
        },
        {
            amount: 10000,
            currency: "EUR",
            type: "withdraw",
            date: new Date()
        },
        {
            amount: 10000,
            currency: "CZK",
            type: "deposit",
            date: new Date()
        },
        {
            amount: 100,
            currency: "EUR",
            type: "payment",
            converted: 2500,
            date: new Date()
        },
        {
            amount: 10000,
            currency: "EUR",
            type: "withdraw",
            date: new Date()
        },
        {
            amount: 10000,
            currency: "CZK",
            type: "deposit",
            date: new Date()
        },
        {
            amount: 100,
            currency: "EUR",
            type: "payment",
            converted: 2500,
            date: new Date()
        },
        {
            amount: 10000,
            currency: "EUR",
            type: "withdraw",
            date: new Date()
        },
        {
            amount: 10000,
            currency: "CZK",
            type: "deposit",
            date: new Date()
        },
        {
            amount: 100,
            currency: "EUR",
            type: "payment",
            converted: 2500,
            date: new Date()
        },
        {
            amount: 10000,
            currency: "EUR",
            type: "withdraw",
            date: new Date()
        }

    ]

    const TransactionIcon: Record<TransactionType, React.ReactElement> = {
        "deposit": <MiniPlus />,
        "withdraw": <MiniMinus />,
        "payment": <MiniBanknotes />
    }

    const TransactionColour: Record<TransactionType, string> = {
        "deposit": "text-green-400",
        "withdraw": "text-red-400",
        "payment": "text-white"
    }


    return (
        <Modal {...props}>
            <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between">
                    <Dialog.Title className="text-amber-400 text-3xl uppercase font-bold">
                        Výpis z účtu
                    </Dialog.Title>

                    <button onClick={() => props.setIsOpen(false)}>
                        <XMark />
                    </button>
                </div>

                <div className="bg-">
                    <AccountSelector
                        data={props.accounts}
                    />
                </div>

                <ul className="flex flex-col gap-1 my-auto overflow-y-scroll">
                    {
                        data.map((transaction, index) => (
                            <li
                                key={index}
                                className={`p-4 bg-neutral-800 flex items-center justify-between ${TransactionColour[transaction.type]}`}
                            >
                                <span className="flex gap-4 items-center">
                                    { TransactionIcon[transaction.type] }
                                    { transaction.date.toLocaleDateString() }
                                </span>
                                <span>
                                    { getCurrencyFormatter(transaction.currency).format(transaction.amount) }
                                </span>
                            </li>
                        ))

                    }
                </ul>

                <div className="flex gap-4 mt-auto">
                    <button
                        className="w-full inline-flex justify-center transition duration-75 px-4 py-2 border hover:bg-amber-400 hover:text-black border-amber-400 text-amber-400 text-base font-medium focus:outline-none sm:w-auto sm:text-sm"
                        onClick={() => props.setIsOpen(false)}
                    >
                        Zavřít
                    </button>
                </div>
            </div>
        </Modal>
    )
}