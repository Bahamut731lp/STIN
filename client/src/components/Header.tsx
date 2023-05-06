import { Link } from "wouter";

export default function Header() {
    return (
        <header className="w-full">
            <nav className="px-4 lg:px-6 py-2.5 bg-neutral-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link href="/" className="flex items-center cursor-pointer">
                        <span className="self-center text-xl font-semibold whitespace-nowrap bg-logo cursor-pointer">POMPEJSKÁ SPOŘITELNA</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <Link href="/login" className="flex items-center cursor-pointer">
                            <span className="cursor-pointer text-neutral-400 hover:text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-neutral-700 focus:outline-none focus:ring-neutral-800">Přihlásit</span>
                        </Link>
                        <Link href="/register" className="flex items-center cursor-pointer">
                            <span className="cursor-pointer text-neutral-400 hover:text-white font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-neutral-700 focus:outline-none focus:ring-neutral-800">Registrovat</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}