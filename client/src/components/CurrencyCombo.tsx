import { Combobox } from "@headlessui/react";
import { useState } from "react";
import Currencies from "../lib/Currencies.json"

export type Currency = keyof typeof Currencies;

export default function CurrencyCombo() {
    const currencies = Object.keys(Currencies) as Currency[];
    const [selected, setSelected] = useState(currencies[0])
    const [query, setQuery] = useState('')

    const filteredCurrencies =
        query === ''
            ? currencies
            : currencies.filter((currency) =>
                currency
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <Combobox value={selected} onChange={setSelected}>
            <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        className="bg-transparent focus:border-amber-400 transition duration-75 text-white border-b-2 border-amber-400/25 w-full leading-none py-2 px-2 focus:outline-none font-mono font-extralight text-xl lg:text-4xl"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCurrencies.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        filteredCurrencies.map((currency) => (
                            <Combobox.Option
                                key={currency}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-400 text-black' : 'text-gray-900'
                                    }`
                                }
                                value={currency}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {currency}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                    }`}
                                            >
                                                Y
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        ))
                    )}
                </Combobox.Options>
            </div>
        </Combobox>
    )
}