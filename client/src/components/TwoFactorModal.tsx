import { useLocation } from 'wouter';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import DigitInput from './DigitInput';
import toast from 'react-hot-toast';

interface TwoFactorModalProps {
    mail: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TwoFactorModal({ isOpen, setIsOpen, ...props }: TwoFactorModalProps) {
    const DIGITS = 6;

    const [, setLocation] = useLocation();
    const [token, setToken] = useState("");


    function closeModal() {
        setIsOpen(false)
    }

    async function check() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: props.mail, token })
        };

        const API_URL = new URL(window.location.href);
        API_URL.port = import.meta.env.VITE_API_PORT;
        API_URL.pathname = "/auth/twofactor";

        const response = await fetch(API_URL.toString(), options);
        const json = await response.json();
        
        if (json.data.isValid) {
            localStorage.setItem("_ps_sess", btoa(options.body));
            setLocation("/dashboard")
        } else {
            toast.error("Kód dvoufázového ověření není správný");
        }
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded bg-neutral-800 p-8 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
                                    <Dialog.Title
                                        as="h1"
                                        className="text-4xl font-medium leading-6 text-amber-400"
                                    >
                                        Dvoufázové ověření
                                    </Dialog.Title>
                                    <Dialog.Description className="text-neutral-500">
                                        Níže zadejte kód z vaší aplikace pro dvoufázové ověření k účtu <code>{props.mail}</code>
                                    </Dialog.Description>
                                    <div className="flex gap-2 my-2">
                                        <DigitInput
                                            digits={DIGITS}
                                            onChange={(v) => { setToken(v) }}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button onClick={() => check()} type="button" className="w-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75 py-2">ODESLAT</button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
