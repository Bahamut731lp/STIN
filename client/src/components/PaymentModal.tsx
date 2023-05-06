import { Dialog } from "@headlessui/react";
import { useState, useContext } from "react";

import Account from "../interface/Account";

import Modal, { ModalProps } from "./Modal";
import CurrencyCombo from "./CurrencyCombo";
import AccountSelector from "./AccountSelector";
import { XMark } from "./Icons";

interface PaymentModalProps extends Pick<ModalProps, "isOpen" | "setIsOpen"> {
    accounts: Account[]
    active: string
}

export default function PaymentModal(props: PaymentModalProps) {
    const [value, setValue] = useState(0)
    const [currency, setCurrency] = useState(null);
    
    return (
        <Modal {...props}>
            <div className="flex flex-col gap-4 h-full">
                <div className="flex justify-between">
                    <Dialog.Title className="text-amber-400 text-xl lg:text-3xl uppercase font-bold">
                        Zaplatit
                    </Dialog.Title>

                    <button onClick={() => props.setIsOpen(false)}>
                        <XMark/>
                    </button>
                </div>

                <div>
                    <AccountSelector 
                        data={props.accounts}
                    />
                </div>


                <div className="flex flex-col sm:flex-row gap-2 my-auto">
                    <input 
                        type="number"
                        onChange={(e) => setValue(Number(e.target.value))}
                        value={value}
                        className="bg-transparent focus:border-amber-400 transition duration-75 text-white border-b-2 border-amber-400/25 w-full leading-none py-2 px-2 focus:outline-none font-mono font-extralight text-xl lg:text-4xl"
                    />
                    <div className="w-full sm:w-1/6">
                        <CurrencyCombo/>
                    </div>
                </div>


                <div className="flex gap-4 mt-auto">
                    <button
                        className="w-full inline-flex justify-center transition duration-75 px-4 py-2 border hover:bg-amber-400 hover:text-black border-amber-400 text-amber-400 text-base font-medium focus:outline-none sm:w-auto sm:text-sm"
                        onClick={() => props.setIsOpen(false)}
                    >
                        Odeslat
                    </button>
                </div>
            </div>
        </Modal>
    )
}