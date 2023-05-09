import { Combobox } from "@headlessui/react";
import { useState, useEffect, useContext } from "react";
import { MiniChevronRight } from "./Icons";
import useSWR from "swr";
import AccountsContext from "./AccountsContext";
import { Identifier } from "../interface/Account";

interface CurrencyComboProps {
    onChange: (value: string) => void
    account: Identifier
}

async function fetcher(url: string) {
    const API_URL = new URL(window.location.href);
    API_URL.port = import.meta.env.VITE_API_PORT;
    API_URL.pathname = url;

    const response = await fetch(url);
    const json = await response.json();
    return json.data as string[];
}

export default function CurrencyCombo(props: CurrencyComboProps) {
    const [_accounts] = useContext(AccountsContext);
    const index = Math.max(0, _accounts.findIndex((v) => v.identifier.prefix == props.account.prefix));
    const { data } = useSWR('/currencies', fetcher)
    const [selected, setSelected] = useState(data?.[index] ?? "CZK")
    const [query, setQuery] = useState('')

    //Při změně měny se změna ohlásí vejš
    useEffect(() => {
        props.onChange(selected);
    }, [props, selected]);

    //Nastavení defaultní měny v moment, co jí máme (podle účtu)
    useEffect(() => {
        setSelected(_accounts[index].currency)
    }, [index, _accounts]);

    if (!data?.length) return null;

    const filteredCurrencies =
        query === ''
            ? data
            : data.filter((currency) =>
                currency
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <Combobox value={selected} onChange={setSelected}>
            <div className="relative h-full">
                <div className="relative w-full h-full cursor-default overflow-hidden text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                        className="bg-transparent h-full focus:border-amber-400 transition duration-75 text-white border-b-2 border-amber-400/25 w-full leading-none py-2 px-2 focus:outline-none font-mono font-extralight"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCurrencies.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        filteredCurrencies?.length ? filteredCurrencies.map((currency) => (
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
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                        >
                                            {currency}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-black'}`}
                                            >
                                                <MiniChevronRight></MiniChevronRight>
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        )) : null
                    )}
                </Combobox.Options>
            </div>
        </Combobox>
    )
}