import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import * as OTPAuth from "https://deno.land/x/otpauth@v9.1.1/dist/otpauth.esm.js"

export default async function getTwoFactorSecret(user: string) {
    const totp = new OTPAuth.TOTP({
        issuer: "PompejskaSporitelna",
        label: user,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: "NB2W45DFOIZA", // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
    });

    const uri = totp.toString();
    const base64Image = await qrcode(uri, { size: 500, typeNumber: 1 });

    return {
        uri,
        qr: base64Image
    }
}