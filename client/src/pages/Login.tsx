import { useState, useEffect } from "react"
import Image from "../assets/pavellopata.jpg"
import Input from "../components/Input"
import toast from 'react-hot-toast';
import CustomToaster, { Toast } from "../components/Toast";
import TwoFactorModal from "../components/TwoFactorModal";
import { useLocation } from "wouter";
import Header from "../components/Header";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [, setLocation] = useLocation();

    useEffect(() => {
        /**
         * Funkce pro vyzkoušení, jestli náhodou nemáme aktivní session
         * Pokud totiž jo, tak skipneme přihlašování
         */
        async function tryExistingSession() {
            const session = atob(localStorage.getItem("_ps_sess") ?? "");
            let email, token;

            try {
                const json = JSON.parse(session);
                email = json.email;
                token = json.token;
            } catch (error) {
                return;
            }

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token })
            };

            const response = await fetch('http://localhost:8000/auth/validate', options);
            if (response.status == 200) setLocation("/dashboard");
        }

        tryExistingSession();
    }, [])


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

        if (String(result.status).startsWith("2")) toast.success("Byly zadány správné přihlašovací údaje", {id: t});
        else toast.error(result.title, {id: t})

        if ([200, 401].some(v => result.status == v)) setIsOpen(true);
    }

    return (
        <main className="w-screen min-h-screen flex flex-col bg-neutral-950">
            <Header></Header>
            <div className="flex-1 grid place-items-center px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
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
            <TwoFactorModal isOpen={isOpen} setIsOpen={setIsOpen} mail={email}/>
        </main>
    )
}