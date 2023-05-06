import useSWR from "swr";
import AccountWidget from "../components/AccountWidget"
import AccountsContext, { AccountsProvider } from '../components/AccountsContext'
import AccountCreationModal from "../components/AccountCreationModal";
import { useContext, useEffect, useState } from "react"
import { useLocation } from "wouter";
import { Leave } from "../components/Icons"
import Button from "../components/Button";

async function fetcher(url: string) {
    const session = localStorage.getItem("_ps_sess");

    //TODO: Přesměrovat dopiče
    if (!session) throw new Error();
    const { email, token } = JSON.parse(atob(session ?? ""))
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Basic ${btoa(`${email}:${token}`)}`
        }
    };

    const address = new URL(url);
    address.searchParams.append("email", email);

    const response = await fetch(address.href, options);
    const json = await response.json();
    return json.data;
}

function Dashboard() {
    const [accountCreation, setAccountCreation] = useState(false);

    const { data, isLoading } = useSWR('http://localhost:8000/user', fetcher)
    const [_accounts, _setAccounts] = useContext(AccountsContext);
    const [, setLocation] = useLocation();


    //Tady řešíme co s odpovědí od serveru
    useEffect(() => {
        if (!isLoading) {
            _setAccounts(data.accounts)
        }
    }, [data, isLoading, _setAccounts]);

    function handleLogout() {
        //asdasd
        setLocation("/logout")
    }

    return (
        <div className="w-screen min-h-screen flex flex-col">
            <nav className="grid grid-cols-2 sm:grid-cols-3 items-center bg-neutral-900 text-white p-8">
                <h1 className="hidden sm:block bg-gradient-to-bl from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text font-extrabold uppercase tracking-tighter text-transparent text-xl">Pompejská spořitelna</h1>
                {
                    isLoading ? (
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 animate-pulse"></div>
                    ) : (
                        <span className='text-left sm:text-center text-xl font-light'>{data.user.name}</span>
                    )
                }
                <span className="flex justify-end gap-4">
                    <Button className="text-xs" onClick={() => setAccountCreation(true)}>
                        Nový účet
                    </Button>
                    <button className="text-amber-400 justify-self-end" onClick={handleLogout}>
                        <Leave />
                    </button>
                </span>
            </nav>
            <main className="bg-neutral-950 flex-1 p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {
                        Array.isArray(_accounts) && _accounts.length > 0 ? _accounts.map((account, index) => (
                            <AccountWidget
                                key={index}
                                amount={account.amount}
                                identifier={account.identifier}
                                currency={account.currency}
                            />
                        )) : (
                            <p className="text-neutral-400 text-center col-span-12">K tomuto účtu nebyly nalezeny žádné příslušné účty.</p>
                        )
                    }
                </div>
            </main>

            <AccountCreationModal isOpen={accountCreation} accounts={_accounts} setIsOpen={setAccountCreation} />
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