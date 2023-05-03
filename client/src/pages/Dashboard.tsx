import AccountWidget from "../components/AccountWidget"
import { Leave } from "../components/Icons"
import AccountsContext, { AccountsProvider } from '../components/AccountsContext'
import { useContext, useEffect } from "react"

function Dashboard() {
    //TODO: napojit na API
    //const { _data, error, isLoading } = useSWR('/api/v1/user', fetcher)

    const [_accounts] = useContext(AccountsContext);
    const data = {
        user: {
            name: "Kevin Daněk",
            email: "test@test.com"
        }
    }

    return (
        <div className="w-screen min-h-screen flex flex-col">
            <nav className="grid grid-cols-3 items-baseline bg-neutral-900 text-white p-8">
                <h1 className="bg-gradient-to-bl from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text font-extrabold uppercase tracking-tighter text-transparent text-xl">Pompejská spořitelna</h1>
                <span className='text-center'>{data.user.name}</span>
                <button className="text-amber-400 place-self-end">
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