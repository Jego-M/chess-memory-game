import type React from "react"

type Props = {
    progressBarRef: React.RefObject<HTMLDivElement | null>,
    onContinue: () => void
}

export default function RememberBar(props: Props) {
    
    //const progress = .2
    //style={{["--pct" as any]: progress}} 

    return (
        <div className="remember-bar">
            Remember the position!
            <button className="remember-bar-button" onClick={props.onContinue}>
                Continue
            </button>
            <div className="progress-bar" ref={props.progressBarRef}/>
        </div>
    )
}