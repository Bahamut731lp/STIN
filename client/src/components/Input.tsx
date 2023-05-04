import { forwardRef } from "react"

const Input = forwardRef((props:React.ComponentProps<"input">, ref) => (
    <input {...props} ref={ref} className={`placeholder:text-neutral-500 bg-transparent focus:border-amber-400 transition duration-75 text-white border-b-2 border-amber-400/25 w-full leading-none py-2 px-2 focus:outline-none font-mono font-extralight ${props.className ?? ""}`} />
));

export default Input;