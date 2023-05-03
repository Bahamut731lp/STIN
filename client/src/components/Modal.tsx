import * as React from "react"
import { Dialog } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"

export interface ModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    children?: React.ReactElement | React.ReactElement[]
}

export const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
    return (
        <AnimatePresence>
            {
                isOpen && (
                    <Dialog
                        static
                        as={motion.div}
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        className="fixed inset-0 z-10 flex items-center justify-center"
                        >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="z-50 w-11/12 xl:w-1/2 h-1/2 bg-neutral-900 p-8 text-white"
                        >
                            {
                                children ?? null
                            }
                        </motion.div>
                    </Dialog>
                )
            }

        </AnimatePresence>
    )
}

export default Modal