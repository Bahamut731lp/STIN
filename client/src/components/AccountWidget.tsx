import { useState } from "react";
import AccountWidgetAction from "./AccountWidgetAction";
import DepositModal from "./DepositModal";
import { MiniCard, MiniPlus, MiniPrint } from "./Icons";

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
    
    const formatter = new Intl.NumberFormat("cs-CZ", {
        "style": "currency",
        "currency": props.currency
    });

    return (
        <div className="inline-grid gap-8 p-8 bg-neutral-800">
            <DepositModal isOpen={deposit} setIsOpen={setDeposit} />
            <div className="flex flex-col">
                <h1 className="text-4xl text-white font-bold">{formatter.format(props.amount)}</h1>
                <span className="text-neutral-600">{props.identifier.prefix}-{props.identifier.base}/{props.identifier.bank}</span>
            </div>
            <div className="flex gap-16">
                <AccountWidgetAction onClick={() => setDeposit(true)}>
                    <MiniPlus/>
                    <span>Vklad</span>
                </AccountWidgetAction>

                <AccountWidgetAction onClick={() => alert("Ahoj!")}>
                    <MiniCard/>
                    <span>Zaplatit</span>
                </AccountWidgetAction>

                <AccountWidgetAction onClick={() => alert("Ahoj!")}>
                    <MiniPrint/>
                    <span>Výpis</span>
                </AccountWidgetAction>
            </div>

  
        </div>
    )
}