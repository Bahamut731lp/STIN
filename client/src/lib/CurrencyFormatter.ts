export default function getCurrencyFormatter(currency: string) {
    return new Intl.NumberFormat("cs-CZ", {
        "style": "currency",
        "currency": currency,
        "maximumFractionDigits": 0
    })
}