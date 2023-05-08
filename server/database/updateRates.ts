import rates from "../database/exchange.ts";
import getRateData from "../lib/getRateData.ts";
import log from "../lib/logger.ts";

export default async function updateRates() {
    log.debug("Running task to update currency rates.");
    const data = await getRateData();

    if (!data) {
        log.debug("Rates are up to date");
        return
    }
    
    await rates.drop();
    await rates.insertMany(data);
    log.debug("Rates updated.");
}