interface AccountWidgetActionProps {
    children: React.ReactElement | React.ReactElement[];
    onClick: React.MouseEventHandler;
}

export default function AccountWidgetAction(props: AccountWidgetActionProps) {
    return (
        <button className="flex gap-2 text-amber-400 hover:text-amber-200 transition duration-75" onClick={props.onClick}>
            { props.children }
        </button>
    )
}