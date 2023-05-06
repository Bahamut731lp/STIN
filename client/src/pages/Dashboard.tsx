import useSWR from "swr";
import AccountWidget from "../components/AccountWidget"
import AccountsContext, { AccountsProvider } from '../components/AccountsContext'
import { Leave } from "../components/Icons"
import { useContext, useEffect } from "react"
import { useLocation } from "wouter";

async function fetcher() {
    const session = localStorage.getItem("_ps_sess");
    const data = JSON.parse(JSON.stringify(session));
    const { email, token } = data;
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            "Authorization": `Basic ${btoa(`${email}:${token}`)}`
        },
        body: '{"email":"pavel.vacha@buzerant.me","token":"849508"}'
    };

    const response = await fetch('http://localhost:8000/user', options);
    const json = await response.json();
    return json;
}

function Dashboard() {
    const { _data, error, isLoading } = useSWR('/api/v1/user', fetcher)

    const [_accounts] = useContext(AccountsContext);
    const [, setLocation] = useLocation();


    const data = {
        user: {
            name: "Kevin Daněk",
            email: "test@test.com"
        }
    }

    function handleLogout() {
        //asdasd
        setLocation("/logout")
    }

    return (
        <div className="w-screen min-h-screen flex flex-col">
            <nav className="grid grid-cols-2 sm:grid-cols-3 items-center bg-neutral-900 text-white p-8">
                <h1 className="hidden sm:block bg-gradient-to-bl from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text font-extrabold uppercase tracking-tighter text-transparent text-xl">Pompejská spořitelna</h1>
                <span className='text-left sm:text-center'>{isLoading}</span>
                <button className="text-amber-400 justify-self-end" onClick={handleLogout}>
                    <Leave />
                </button>
            </nav>
            <main className="bg-neutral-950 flex-1 p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {
                        Array.isArray(_accounts) ? _accounts.map((account, index) => (
                            <AccountWidget
                                key={index}
                                amount={account.amount}
                                identifier={account.identifier}
                                currency={account.currency}
                            />
                        )) : (
                            <p>K tomuto účtu nebyly nalezeny žádné příslušné účty.</p>
                        )
                    }
                </div>
            </main>
        </div>
    )
}

export default function Wrapped() {
    return (
        <AccountsProvider>
            <Dashboard></Dashboard>
        </AccountsProvider>
    )
}