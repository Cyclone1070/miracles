import { mergeClasses } from "../utils/tailwindMerge";

interface Props {
    className?: string;
    location?: string;
}

export function BgImage({ ...props }: Props) {
    return (
        <div className={mergeClasses(`@container absolute inset-0 flex justify-center items-center`, props.className)}>
            {props.location === "heaven" ? <img className='adaptive-size' src="/heaven.png" alt="a heaven courtyard" /> : null}
        </div>
    );
}
