export default function fetcher(input: RequestInfo | URL, init?: RequestInit | undefined) {
    return fetch(input, init).then(res => res.json())
}