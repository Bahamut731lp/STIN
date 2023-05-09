import { TokenReplacer } from "https://deno.land/x/optic@1.3.7/formatters/tokenReplacer.ts";
import { Logger, Level, ConsoleStream } from "https://deno.land/x/optic@1.3.7/mod.ts";

const consoleStream = new ConsoleStream()
    .withMinLogLevel(Level.Debug)
    .withFormat(
        new TokenReplacer()
            .withColor()
            .withDateTimeFormat("DD.MM.YYYY hh:mm:ss:SSS")
    );

const log = new Logger()
log.addStream(consoleStream);

export default log;