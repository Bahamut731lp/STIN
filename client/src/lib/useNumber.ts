import { useState } from "react"

export default function useNumber(defaultValue: number): [number, (value:unknown) => void] {
    const [ state, setState ] = useState(isNaN(defaultValue) ? 0 : defaultValue);

    function handleStateChange(value: unknown) {
        if (!isNaN(Number(value))) return setState(Number(value));
        setState(state)
    }

    return [ state, handleStateChange ];
}