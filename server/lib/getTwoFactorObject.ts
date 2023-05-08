import * as OTPAuth from "https://deno.land/x/otpauth@v9.1.1/dist/otpauth.esm.js"

export default function getTwoFactorObject(uri: string) {

    // Validace, jestli je uri platnou URL
    try {
        new URL(uri);
    } catch (_) {
        return null;
    }

    const totp = OTPAuth.URI.parse(uri);
    return totp;
}