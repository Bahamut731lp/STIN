import { Listbox } from "@headlessui/react"
import { useState, useEffect } from "react"

import Account from "../interface/Account"
import { MiniChevron } from "./Icons";

interface AccountSelectorProps {
    data: Account[]
}

export default function AccountSelector({ data }: AccountSelectorProps) {
    const [selectedPerson, setSelectedPerson] = useState(data[0]);

    useEffect(() => {
        console.log(selectedPerson);
    }, [selectedPerson])


    return (
        <Listbox value={selectedPerson} onChange={setSelectedPerson} as="div" className="relative">
            <Listbox.Button
                className="bg-neutral-800 p-4 w-full text-left flex justify-between"
            >
                <span className="text-neutral-100">{selectedPerson.identifier.prefix}-{selectedPerson.identifier.base}/{selectedPerson.identifier.bank}</span>
                <span className="text-neutral-400 flex gap-2 items-center">{selectedPerson.currency} <MiniChevron /></span>
            </Listbox.Button>
            <Listbox.Options
                className="absolute bg-neutral-800 w-full z-50"
            >
                {
                    data.map((account, index) => (
                        <Listbox.Option
                            key={index}
                            value={account}
                            className="flex justify-between cursor-pointer hover:bg-neutral-600 p-4"
                        >
                            <span className="text-neutral-400">{account.identifier.prefix}-{account.identifier.base}/{account.identifier.bank}</span>
                            <span className="text-neutral-400 flex gap-2 items-center">{account.currency}</span>
                        </Listbox.Option>
                    ))
                }
            </Listbox.Options>
        </Listbox>
    )
}

AccountSelector.defaultProps = {
    data: []
}