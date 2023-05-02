import useSWR from 'swr'
import fetcher from '../lib/Fetcher'
import AccountWidget from "../components/AccountWidget"
import { Leave } from "../components/Icons"
import DepositModal from '../components/DepositModal'
import { Dialog } from '@headlessui/react'

export default function Dashboard() {
    //TODO: napojit na API
    //const { _data, error, isLoading } = useSWR('/api/v1/user', fetcher)

    const data = {
        user: {
            name: "Kevin Daněk",
            email: "test@test.com"
        },
        accounts: [
            {
                amount: 10999,
                currency: "CZK",
                identifier: {
                    prefix: "000001",
                    base: "1234567890",
                    bank: "0666"
                }
            }
        ]
    }

    return (
        <div className="w-screen min-h-screen flex flex-col">
            <nav className="flex justify-between bg-neutral-900 text-white p-8">
                <span></span>
                <h1>{data.user.name}</h1>
                <button className="text-amber-400">
                    <Leave />
                </button>
            </nav>
            <main className="bg-neutral-950 flex-1 p-8">
                <div className="">
                    {
                        Array.isArray(data.accounts) ? data.accounts.map((account, index) => (
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