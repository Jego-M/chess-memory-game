type Props = {
    count: number,
    imageSource: string,
    imageAlt: string,
    animation: string,
}

export default function Counter({count, imageSource, imageAlt, animation}: Props) {
    return (
        <div className={`counter ${animation}`}>
            <img className="counter-image" src={imageSource} alt={imageAlt} />
            <p className="counter-count">
                {count}
            </p>
        </div>
    )
}