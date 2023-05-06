import { motion } from 'framer-motion';
import toast, { ToastBar, Toaster } from 'react-hot-toast';


export function Toast(props) {
    return (
        <motion.div
            id="toast-default"
            className="flex items-center w-full max-w-xs p-4 bg-neutral-800 shadow text-amber-400"
            role="alert"
            layout
            initial={{
                scale: 0.8,
                opacity: 0
            }}
            animate={{
                scale: 1,
                opacity: 1,
                transition: {
                    duration: 0.075
                }
            }}
        >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-amber-500 bg-amber-100 rounded-lg">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-clipRule="evenodd"></path></svg>
                <span className="sr-only">Fire icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">Set yourself free.</div>
        </motion.div>
    )
}

export const Success = () => toast.custom(<Toast></Toast>)


export default function CustomToaster() {
    return (
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: 'bg-neutral-800 text-amber-400 rounded-none',
                duration: 5000,
            }}
        />
    )
}