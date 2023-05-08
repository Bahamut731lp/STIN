class Headers {
    static getAuthorization(input: string | null | undefined) {
        if (!input) return null;

        const headerSplitByWhitespace = input.split(/\s+/gi);
        if (headerSplitByWhitespace?.length < 2) return null;

        let base64DecodedCredentials;
        try {
            base64DecodedCredentials = atob(headerSplitByWhitespace.pop()!);
        }
        catch(_) {
            return null;
        }

        const splittedCredentials = base64DecodedCredentials.split(":").filter(v => v);
        if (splittedCredentials?.length < 2) return null;
        
        const [email, token] = splittedCredentials;
        return {email, token};
    }
}

export default Headers;