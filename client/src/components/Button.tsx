
export default function Button(props: React.ComponentProps<"button">) {
    return (
        <button {...props} className="border px-4 py-2 text-sm border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75">
            {props.children}
        </button>
    )
}