export default interface DatabaseSchema {
    user: {
        name: string;
        email: string;
        password: string;
    }
    accounts: {
        amount: number,
        currency: string,
        identifier: {
            prefix: string,
            base: string,
            bank: string
        }
    }[]
}