import { useLocation } from 'wouter';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface QRCodeModalProps {
    isOpen: boolean;
    qr: string;
    mail: string;
}

export default function QRCodeModal({ isOpen, qr, mail }: QRCodeModalProps) {

    const [, setLocation] = useLocation();

    function handleClosing() {
        const confirmation = confirm("Jste si jistý, že chcete toto okno zavřít? Po zavření půjde QR kód znovu ukázat až po úspěšném přihlášení!");
        if (!confirmation) return;

        setLocation("/login");
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={handleClosing}>
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
                                <Dialog.Panel className="flex flex-col items-center w-full max-w-4xl transform overflow-hidden rounded bg-neutral-800 p-8 text-left align-middle shadow-xl transition-all gap-4">
                                    <div className='w-full flex gap-8'>
                                        <div className='flex flex-col gap-4 flex-1'>
                                            <Dialog.Title
                                                as="h1"
                                                className="text-4xl font-medium leading-6 text-amber-400"
                                            >
                                                Dvoufázové ověření
                                            </Dialog.Title>
                                            <Dialog.Description className="text-neutral-500">
                                                Níže zadejte kód z vaší aplikace pro dvoufázové ověření k účtu <code>{mail}</code>. Tento QR kód si naskenujte do Vaší autentizační aplikace jako je například Google Authenticator či Twilio Authy.
                                            </Dialog.Description>
                                        </div>

                                        <div className="flex gap-2 my-2">
                                            <img src={qr} alt="" className='w-64' />
                                        </div>
                                    </div>


                                    <div className="mt-4">
                                        <button onClick={handleClosing} type="button" className="px-4 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75 py-2 uppercase" >Zavřít</button>
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
