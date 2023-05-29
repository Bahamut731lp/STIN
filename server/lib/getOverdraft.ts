const CORRECTION = 0.1;

export default function getOverdraft(balance: number) {
    return Math.floor(balance + balance * CORRECTION);
}