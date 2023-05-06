export default interface DatabaseSchema {
    twofactor?: boolean;
    user: {
        name: string;
        email: string;
        password: string;
        secret: {
            uri: string;
            qr?: string;
        }
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