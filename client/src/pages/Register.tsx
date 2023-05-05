import { useState, useEffect } from "react"
import Input from "../components/Input"
import toast from 'react-hot-toast';
import CustomToaster, { Toast } from "../components/Toast";
import { useLocation } from "wouter";
import QRCodeModal from "../components/QRCodeModal";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");

    const [qr, setQR] = useState("");
    const [qrModal, setQRModal] = useState(false);

    const isMatching = password == secondPassword;
    const isEmpty = password == "" && secondPassword == "";


    async function submit() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        };

        const response = await fetch('http://localhost:8000/auth/register', options)
        const json = await response.json();

        if (!String(response.status).startsWith("2")) return;
        
        setQR(json.data.user.secret.qr)
        setQRModal(true);
    }

    return (
        <main className="w-screen min-h-screen grid place-items-center bg-neutral-950">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full lg:w-1/2 md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6">
                    <span className="bg-logo text-2xl font-extrabold">Pompejská spořitelna</span>
                </a>
                <div className="w-full bg-neutral-800 rounded-lg shadow">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-neutral-900 md:text-2xl dark:text-white">
                            Vytvořit účet
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Jméno</label>
                                <Input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" placeholder="jmeno"></Input>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">E-mail</label>
                                <Input autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="jmeno@domena.cz"></Input>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Heslo</label>
                                <Input autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" ></Input>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Potvrdit heslo</label>
                                <Input autoComplete="off" value={secondPassword} onChange={(e) => setSecondPassword(e.target.value)} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" ></Input>
                            </div>
                            <div className="flex items-center text-xs gap-4 text-neutral-500">
                                <span className={`flex w-3 h-3 ${isEmpty ? "bg-neutral-400" : (isMatching ? "bg-green-500" : "bg-red-500")} rounded-full`}></span>
                                <span>
                                    {
                                        isEmpty ? (
                                            <>Hesla jsou prázdná</>
                                        ) : (
                                            isMatching ? (
                                                <>Hesla jsou shodná</>
                                            ) : (
                                                <>Hesla nejsou shodná</>
                                            )
                                        )
                                    }
                                </span>

                            </div>
                            <button disabled={name == "" || email == "" || !isMatching || isEmpty} onClick={() => submit()} type="button" className="w-full uppercase border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75 py-2 disabled:pointer-events-none disabled:opacity-50">Vytvořit účet</button>
                            <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
                                Máte již účet? <a href="#" className="font-medium text-amber-400 hover:underline">Přihlášte se</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div >
            <CustomToaster />
            <QRCodeModal isOpen={qrModal} qr={qr} mail={email}/>
        </main >
    )
}