import { Dialog } from "@headlessui/react";
import { useState } from "react";

import Account, { Identifier } from "../interface/Account";
import AccountSelector from "./AccountSelector";
import Transaction, { TransactionType } from "../interface/Transaction";

import Modal, { ModalProps } from "./Modal";
import { MiniBanknotes, MiniMinus, MiniPlus } from "./Icons";
import getCurrencyFormatter from "../lib/CurrencyFormatter";
import Button from "./Button";

interface AccountHistoryModalProps extends Pick<ModalProps, "isOpen" | "setIsOpen"> {
    accounts: Account[]
    active: string
}

export default function AccountHistoryModal(props: AccountHistoryModalProps) {
    const [account, setAccount] = useState<Identifier>({ bank: "0666", base: "", prefix: "" });
    const accountIndex = props.accounts.findIndex((acc) => acc.identifier.prefix == account.prefix)

    console.log(props.accounts?.[accountIndex]?.history)
    const TransactionIcon: Record<TransactionType, React.ReactElement> = {
        "deposit": <MiniPlus />,
        "withdraw": <MiniMinus />,
        "payment": <MiniBanknotes />
    }

    const TransactionColour: Record<TransactionType, string> = {
        "deposit": "text-green-400",
        "withdraw": "text-red-400",
        "payment": "text-red-400"
    }

    return (
        <Modal {...props}>
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 border-neutral-700">
                <h3 className="text-lg font-semibold text-white">
                    Vytvořit nový účet
                </h3>
                <button type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:text-white" data-modal-toggle="defaultModal">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <AccountSelector
                        active={props.active}
                        data={props.accounts}
                        onChange={(value) => setAccount(value)}
                    />
                </div>

                <ul className="flex flex-col gap-1 my-auto overflow-y-scroll h-64">
                    {
                        accountIndex >= 0 ? (
                            props.accounts[accountIndex].history.map((transaction, index) => (
                                <li
                                    key={index}
                                    className={`p-4 bg-neutral-800 flex items-center justify-between ${TransactionColour[transaction.type]}`}
                                >
                                    <span className="flex gap-4 items-center">
                                        {TransactionIcon[transaction.type]}
                                        {new Date(transaction.date).toLocaleString()}
                                    </span>
                                    <span>
                                        {getCurrencyFormatter(transaction.conversion?.from).format(transaction.amount)}
                                    </span>
                                </li>
                            ))
                        ) : (
                            <p>T</p>
                        )

                    }
                </ul>
                <Button onClick={() => props.setIsOpen(false)}>
                    Zavřít
                </Button>
            </div>
        </Modal>
    )
}