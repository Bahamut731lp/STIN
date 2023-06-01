import { useState } from "react";
import { mutate } from "swr";

import Account from "../interface/Account";
import Modal, { ModalProps } from "./Modal";
import CurrencyCombo from "./CurrencyCombo";
import Button from "./Button";
import Input from "./Input";
import useNumber from "../lib/useNumber";

interface PaymentModalProps extends Pick<ModalProps, "isOpen" | "setIsOpen"> {
    accounts: Account[];
    active: string;
}

export default function PaymentModal(props: PaymentModalProps) {
    const [currency, setCurrency] = useState("");
    const [value, setValue] = useNumber(0)

    async function handleSubmission() {
        const { email, token } = JSON.parse(atob(localStorage.getItem("_ps_sess") ?? ""))

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Basic ${btoa(`${email}:${token}`)}`
            },
            body: JSON.stringify({
                "amount": value,
                "currency": currency
            })
        };

        const API_URL = new URL(window.location.href);
        API_URL.port = import.meta.env.VITE_API_PORT;
        API_URL.pathname = "/user/account/pay";

        await fetch(API_URL.toString(), options);
        mutate("/user")
        props.setIsOpen(false);
    }

    return (
        <Modal {...props}>
            <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 border-neutral-700">
                    <h3 className="text-lg font-semibold text-white">
                        Nová platba
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:text-white"
                        data-modal-toggle="defaultModal"
                        onClick={() => props.setIsOpen(false)}
                    >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 my-auto">
                        <Input
                            type="text"
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        ></Input>
                        <div className="w-full sm:w-1/6">
                            <CurrencyCombo
                                onChange={(value) => setCurrency(value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                        <Button onClick={() => handleSubmission()}>
                            Vytvořit
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}