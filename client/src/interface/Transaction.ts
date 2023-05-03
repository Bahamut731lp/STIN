
export type TransactionType = "deposit" | "withdraw" | "payment"

export default interface Transaction {
    type: TransactionType;
    currency: string;
    amount: number;
    converted?: number;
    date: Date
}