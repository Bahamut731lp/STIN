import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import * as OTPAuth from "https://deno.land/x/otpauth@v9.1.1/dist/otpauth.esm.js"
import * as Base32 from "https://deno.land/std@0.186.0/encoding/base32.ts";

export default async function getTwoFactorSecret(user: string) {
    const totp = new OTPAuth.TOTP({
        issuer: "PompejskaSporitelna",
        label: user,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: Base32.encode(crypto.getRandomValues(new Uint8Array(10))), // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
    });

    const uri = totp.toString();
    const base64Image = await qrcode(uri, { size: 500, typeNumber: 1 });

    return {
        uri,
        qr: base64Image
    }
}