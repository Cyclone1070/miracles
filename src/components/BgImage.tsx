interface Props {
    classsName?: string;
    location?: string;
}

export function BgImage({ ...props }: Props) {
    return (
        <div className={`absolute w-full h-full ${props.classsName || ''}`}>
            {props.location === "heaven" ? <img className='w-full h-full object-cover' src="../public/heaven.png" alt="a heaven courtyard" /> : null}
        </div>
    );
}
