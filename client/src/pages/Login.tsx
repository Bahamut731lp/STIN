import { useState } from "react"
import Image from "../assets/pavellopata.jpg"
import Input from "../components/Input"
import toast from 'react-hot-toast';
import CustomToaster, { Toast } from "../components/Toast";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function getResult() {
        const options: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };

        const response =  await fetch('http://127.0.0.1:8000/auth/login', options)
        const json = await response.json();

        return json;
    }

    async function submit() {
        const t = toast.custom(<Toast>{}</Toast>);
        const result = await getResult();

        if (String(result.status).startsWith("2")) toast.success("Byly zadány správné přihlašovací údaje", {id: t})
        else toast.error(result.title, {id: t})
    }

    return (
        <main className="w-screen min-h-screen grid place-items-center bg-neutral-950">
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
                <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-neutral-800 rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
                        <div className="w-full px-6 py-3">
                            <div>
                                <div className="mt-3 text-left sm:mt-5">
                                    <div className="inline-flex items-center w-full">
                                        <h3 className="text-lg font-bold text-amber-400 uppercase lg:text-4xl">Přihlásit se</h3>
                                    </div>
                                    <div className="mt-4 text-xs text-neutral-400">
                                        <p>Do bankovního systém <span className="bg-logo font-extrabold">Pompejské spořitelny</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <Input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Zadejte svůj e-mail" autoComplete="off" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <Input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Zajdete heslo" autoComplete="off" />
                                </div>
                                <div className="flex flex-col mt-4 lg:space-y-2">
                                    <button onClick={() => submit()} type="button" className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75 py-2">Přihlásit</button>
                                    <a href="#" type="button" className="inline-flex justify-center py-4 text-base font-medium text-neutral-500 sm:text-sm"> Zapomenuté heslo? </a>
                                </div>
                            </div>
                        </div>
                        <div className="order-first hidden h-full lg:block">
                            <img className="select-none object-cover h-full bg-cover rounded-l-lg" src={Image} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <CustomToaster />
        </main>
    )
}