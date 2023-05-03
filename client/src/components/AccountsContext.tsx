import { useState, createContext, useMemo, useEffect } from "react"
import Account from "../interface/Account";

export const AccountsContext = createContext<[Account[], React.Dispatch<React.SetStateAction<Account[]>>]>([[], () => {}]);

interface AccountsProviderProps {
    children: React.ReactElement | React.ReactElement[]
}

export function AccountsProvider(props: AccountsProviderProps) {
    const [accounts, setAccounts] = useState([] as Account[]);
    const data = useMemo(() => ([
        {
            amount: 10999,
            currency: "CZK",
            identifier: {
                prefix: "000001",
                base: "1234567890",
                bank: "0666"
            }
        },
        {
            amount: 666,
            currency: "EUR",
            identifier: {
                prefix: "000002",
                base: "1234567890",
                bank: "0666"
            }
        },
        {
            amount: 720,
            currency: "JPY",
            identifier: {
                prefix: "000002",
                base: "1234567890",
                bank: "0666"
            }
        }
    ]), [])

    
    useEffect(() => {
        setAccounts(data)
    }, [data])
    

    return (
        <AccountsContext.Provider value={[accounts, setAccounts]}>
            {
                props.children
            }
        </AccountsContext.Provider>
    )
}

export default AccountsContext