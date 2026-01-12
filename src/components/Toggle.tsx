import { useState } from "react"
import type { ReactNode } from "react"

type Props = {
    isOnByDefault: boolean,
    onToggle: (isOn: boolean) => void,
    onIcon?: ReactNode,
    offIcon?: ReactNode
}

export default function Toggle({isOnByDefault, onToggle, onIcon, offIcon}: Props) {

    const [isOn, setIsOn] = useState(isOnByDefault)

    function toggle() {
        setIsOn(prev => !prev)
        onToggle(!isOn)
    }

    const icon = isOn ? onIcon : offIcon

    return (
        <div className="toggle-wrapper">
            {
                icon ? <span className="toggle-icon">{icon}</span> : null
            }
            <button onClick={toggle} className={`toggle ${isOn ? "on" : "off"}`}>
                <div className={`toggle-handle ${isOn ? "on" : "off"}`} />
            </button>
        </div>
    )
}