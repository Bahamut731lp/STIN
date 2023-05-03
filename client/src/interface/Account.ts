export default interface Account {
    amount: number,
    currency: string,
    identifier: {
        prefix: string,
        base: string,
        bank: string
    }
}