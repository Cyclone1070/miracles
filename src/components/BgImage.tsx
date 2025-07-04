interface Props {
    classsName?: string;
    location?: string;
}

export function BgImage({ ...props }: Props) {
    return (
        <div className={`@container absolute inset-0 flex justify-center items-center ${props.classsName || ''}`}>
            {props.location === "heaven" ? <img className='adaptive-size' src="/heaven.png" alt="a heaven courtyard" /> : null}
        </div>
    );
}
