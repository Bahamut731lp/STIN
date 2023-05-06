import { useEffect, RefObject, createRef, useState } from "react";
import Input from "./Input";

interface DigitInputPros {
    digits: number;
    onChange: (value: string) => void;
}

export default function DigitInput(props: DigitInputPros) {
    const [values, setValues] = useState(Array.from({ length: props.digits }, () => ""));
    const inputRefsArray = Array.from({ length: props.digits }, () => createRef<HTMLInputElement>())

    function clamp(index: number) {
        if (index >= props.digits) {
            return props.digits - 1
        }
        else {
            return index;
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLInputElement>, index: number, refs: RefObject<HTMLInputElement>[]) {
        setValues((prev: string[]) => {
            if (prev[index] != "") {
                prev[index] = event.target.value.slice(-1);
            }
            else {
                prev[index] = event.target.value
            }

            return [...prev];
        });

        const nextInput = clamp(index + 1);
        inputRefsArray[nextInput].current?.focus()
    }

    useEffect(() => {
        props.onChange(values.join(""))
    }, [values]); 

    return (
        <>
            {
                values.map((_, index) => (
                    <Input ref={inputRefsArray[index]} key={index} value={values[index]} onChange={(event) => handleInput(event, index, inputRefsArray)} type="number" autoComplete="off" className="text-8xl text-center" />
                ))
            }
        </>
    )
}