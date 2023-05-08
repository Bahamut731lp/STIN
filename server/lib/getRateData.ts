import rates from "../database/exchange.ts";

const KURZ_URL = "https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt"
const SEPARATOR = "|";

/**
 * Funkce pro získání dat z ČNB a uložení do databáze
 */
export default async function getRateData() {
    const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const count = await rates.count();
    const isCurrentByTimestamp = (await rates.findMany(() => true)).every((rate) => rate.timestamp == today);
    const response = await fetch(KURZ_URL);

    if (count != 0 && isCurrentByTimestamp || !response.ok) {
        return;
    }

    const data = await response.text();
    const [_, header, ...rows] = data.trim().split("\n");

    const columns = header
        .split(SEPARATOR)
        .map((key) => key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim())

    const result = rows
        .map((row) => (
            row
                .split(SEPARATOR)
                .map((column, columnindex) => [columns[columnindex], column])
        ))
        .map((v) => Object.fromEntries(v) as Record<string, string>)
        .map(({ mnozstvi, kod, kurz }) => (
            {
                kurz: parseFloat(kurz.replace(",", ".")),
                mnozstvi: parseInt(mnozstvi),
                timestamp: today,
                kod
            }
        ))

    result.push({
        kurz: 1,
        mnozstvi: 1,
        timestamp: today,
        kod: "CZK"
    })

    return result;
}