class Headers {
    static getAuthorization(input: string | null | undefined) {
        if (!input) return null;

        const headerSplitByWhitespace = input.split(/\s+/gi);
        if (headerSplitByWhitespace?.length < 2) return null;

        const base64DecodedCredentials = atob(headerSplitByWhitespace.pop()!);
        const splittedCredentials = base64DecodedCredentials.split(":");
        if (splittedCredentials?.length < 2) return null;
        
        const [email, token] = splittedCredentials;
        return {email, token};
    }
}

export default Headers;