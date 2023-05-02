import { Dialog } from "@headlessui/react";
import Modal, { ModalProps } from "./Modal";


export default function DepositModal(props: Pick<ModalProps, "isOpen" | "setIsOpen">) {
    return (
        <Modal {...props}>
            <Dialog.Title className="text-amber-400 text-3xl">
                Vklad na účet
            </Dialog.Title>
            

            <button
                className="w-full m-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => props.setIsOpen(false)}
            >
                Odeslat
            </button>
            <button
                className="m-4 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => props.setIsOpen(false)}
            >
                Zrušit
            </button>
        </Modal>
    )
}