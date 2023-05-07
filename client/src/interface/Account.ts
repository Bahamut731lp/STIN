export interface Transaction {
    type: "deposit" | "withdraw" | "payment";
    amount: number;
    target: string;
    date: string;
    conversion: {
        from: string;
        to: string;
        rate: number;
    }
}

export interface Identifier {
    prefix: string;
    base: string;
    bank: string;
}

export default interface Account {
    amount: number;
    currency: string;
    identifier: Identifier,
    history: Transaction[]
}