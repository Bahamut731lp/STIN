import { useState, createContext, useMemo, useEffect } from "react"
import Account from "../interface/Account";

export const AccountsContext = createContext<[Account[], React.Dispatch<React.SetStateAction<Account[]>>]>([[], () => {}]);

interface AccountsProviderProps {
    children: React.ReactElement | React.ReactElement[]
}

export function AccountsProvider(props: AccountsProviderProps) {
    const [accounts, setAccounts] = useState([] as Account[]);   

    return (
        <AccountsContext.Provider value={[accounts, setAccounts]}>
            {
                props.children
            }
        </AccountsContext.Provider>
    )
}

export default AccountsContext