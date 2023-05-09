import { useState, useEffect } from "react";
import { useLocation } from 'wouter';

export default function Logout() {
    const [header, setHeader] = useState("");
    const [message, setMessage] = useState("");
    
    const [, setLocation] = useLocation();

    useEffect(() => {
        /**
         * Funkce pro vyzkoušení, jestli náhodou nemáme aktivní session
         * Pokud totiž jo, tak skipneme přihlašování
         */
        async function logoutHandler() {
            const session = atob(localStorage.getItem("_ps_sess") ?? "");
            let email, token;

            try {
                const json = JSON.parse(session);
                email = json.email;
                token = json.token;
            } catch (error) {
                setHeader("Není koho odhlásit.")
                setMessage("Nemohli jsme najít žádnou relaci, ze které Vás odhlásit. Budete automaticky přesměrováni na domovskou stránku.")
                setTimeout(() => {
                    setLocation("/");
                }, 5 * 1000);
                return;
            }

            setHeader("Úspěšně jsme Vás odhlásili.")
            setMessage("Odhlášení proběhlo úspěšně. Za chvilku budete automaticky přesměrováni na domovskou stránku.")

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token })
            };

            const API_URL = new URL(window.location.href);
            API_URL.port = import.meta.env.VITE_API_PORT;
            API_URL.pathname = "/auth/logout";

            const response = await fetch(API_URL.toString(), options);
            if (response.status == 200) {
                localStorage.removeItem("_ps_sess")
            }

            setTimeout(() => {
                setLocation("/");
            }, 5 * 1000);
        }

        logoutHandler();
    })

    
    return (
        <main className="w-screen min-h-screen grid place-items-center bg-neutral-950 text-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-amber-400">Hotovo</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-white">{header}</p>
                    <p className="mb-4 text-lg font-light text-neutral-400">{ message }</p>
                    <button onClick={() => setLocation("/")} type="button" className="mt-8 w-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75 py-2">Zpátky na domovskou stránku</button>
                </div>
            </div>
        </main>
    )
}