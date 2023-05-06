import { Link } from "wouter"
import Coins from "../assets/coins.png"

export default function Homepage() {
    return (
        <main className="bg-neutral-950 min-h-screen">
            <div className="grid h-screen max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white uppercase">Pompejská spořitelna</h1>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">S námi si popel na hlavu sypat nebudete.</p>

                    <div className="flex gap-2">
                        <Link href="/login" className="border px-5 py-3 border-amber-400 bg-amber-400 text-black transition duration-75">
                            Přihlásit
                        </Link>
                        <Link href="/register" className="border px-5 py-3 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-75">
                            Registrovat
                        </Link>
                    </div>

                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <img src={Coins} alt="mockup" className="object-contain select-none" />
                </div>
            </div>
        </main>
    )
}