import { useState } from "react";
import Account from "../interface/Account";
import Button from "./Button";
import CurrencyCombo from "./CurrencyCombo";
import Modal, { ModalProps } from "./Modal";

interface PaymentModalProps extends Pick<ModalProps, "isOpen" | "setIsOpen"> {
    accounts: Account[]
}

export default function AccountCreationModal(props: PaymentModalProps) {
    const [currency, setCurrency] = useState("");
    const hasAccountWithCurrency = props.accounts.find((value) => value.currency == currency)

    async function createAccount() {
        //TODO: Fetch
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
            <div>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="brand" className="block mb-2 text-sm font-medium text-white">Měna</label>
                        <CurrencyCombo onChange={(value) => setCurrency(value)} />
                    </div>
                </div>
                <>
                    {
                        hasAccountWithCurrency ? (
                            <div className="py-4 mb-4 text-sm text-red-800 dark:text-red-400" role="alert">
                                <span className="font-medium">Pozor!</span> Účet s touto měnou již vedete, jste si jistý, že chcete vytvořit další?
                            </div>
                        ) : null
                    }
                </>
                <Button onClick={() => createAccount()}>
                    Vytvořit
                </Button>
            </div>
        </Modal>
    )
}