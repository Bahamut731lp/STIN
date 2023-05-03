import { useState, useContext } from "react";

import { MiniCard, MiniPlus, MiniPrint } from "./Icons";
import AccountWidgetAction from "./AccountWidgetAction";
import AccountsContext from "./AccountsContext";
import DepositModal from "./DepositModal";
import PaymentModal from "./PaymentModal";
import AccountHistoryModal from "./AccountHistoryModal";
import getCurrencyFormatter from "../lib/CurrencyFormatter";

interface AccountWidgetProps {
    amount: number;
    identifier: {
        prefix: string;
        base: string;
        bank: string;
    };
    currency: string;
}

export default function AccountWidget(props: AccountWidgetProps) {
    const [deposit, setDeposit] = useState(false)
    const [payment, setPayment] = useState(false)
    const [transactionHistory, setTransactionHistory] = useState(false)
    
    const [_accounts] = useContext(AccountsContext)

    return (
        <div className="inline-grid gap-8 p-8 bg-neutral-800">

            <DepositModal isOpen={deposit} setIsOpen={setDeposit} accounts={_accounts}/>
            <PaymentModal isOpen={payment} setIsOpen={setPayment} accounts={_accounts}/>
            <AccountHistoryModal isOpen={transactionHistory} setIsOpen={setTransactionHistory} accounts={_accounts}/>

            <div className="flex flex-col">
                <h1 className="text-4xl text-white font-bold">{getCurrencyFormatter(props.currency).format(props.amount)}</h1>
                <span className="text-neutral-600">{props.identifier.prefix}-{props.identifier.base}/{props.identifier.bank}</span>
            </div>
            <div className="flex justify-between">
                <AccountWidgetAction onClick={() => setDeposit(true)}>
                    <MiniPlus/>
                    <span>Vklad</span>
                </AccountWidgetAction>

                <AccountWidgetAction onClick={() => setPayment(true)}>
                    <MiniCard/>
                    <span>Zaplatit</span>
                </AccountWidgetAction>

                <AccountWidgetAction onClick={() => setTransactionHistory(true)}>
                    <MiniPrint/>
                    <span>Výpis</span>
                </AccountWidgetAction>
            </div>

  
        </div>
    )
}