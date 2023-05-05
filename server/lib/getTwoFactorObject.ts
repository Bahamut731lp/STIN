import * as OTPAuth from "https://deno.land/x/otpauth@v9.1.1/dist/otpauth.esm.js"

export default function getTwoFactorSecret(uri: string) {
    const totp = OTPAuth.URI.parse(uri);
    return totp
}