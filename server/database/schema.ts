interface Account {
    amount: number,
    currency: string,
    identifier: {
        prefix: string,
        base: string,
        bank: string
    }
}

export default interface DatabaseSchema {
    user: {
        name: string;
        email: string;
        password: string;
    }
    accounts: Account[]
}