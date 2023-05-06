interface Transaction {
    type: "deposit" | "withdraw" | "payment";
    amount: number;
    target: string;
    conversion?: {
        from: string;
        to: string;
        rate: number;
    }
}

export default interface Account {
    amount: number;
    currency: string;
    identifier: {
        prefix: string;
        base: string;
        bank: string;
    },
    history: Transaction[]
}