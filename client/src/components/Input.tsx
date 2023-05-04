export default function Input(props: Omit<React.ComponentProps<"input">, "className">) {
    return (
        <input {...props} className="placeholder:text-neutral-500 bg-transparent focus:border-amber-400 transition duration-75 text-white border-b-2 border-amber-400/25 w-full leading-none py-2 px-2 focus:outline-none font-mono font-extralight" />
    )
}