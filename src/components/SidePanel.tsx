import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useWindowSize } from "react-use"
import ChessboardIcon from "../assets/svg/chessboard-icon.svg?react"
import CloseIcon from "../assets/svg/close.svg?react"
import MenuIcon from "../assets/svg/menu.svg?react"


export default function SidePanel() {

    const { width } = useWindowSize()

    const [isOpen, setIsOpen] = useState(width >= 1350)

    function handleLinkClicked() {
        if (width >= 1350) return
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <button className="side-panel-menu-button" onClick={() => setIsOpen(true)}>
                <MenuIcon className="side-panel-menu-icon"/>
            </button>
        )
    }
 
    return (
        <section id="side-panel">
            <button className="side-panel-menu-button" onClick={() => setIsOpen(false)}>
                <CloseIcon className="side-panel-menu-icon"/>
            </button>
            <div>
                <Link to="/" className="side-panel-logo-container" onClick={handleLinkClicked}>
                    <ChessboardIcon className="side-panel-icon"/>
                    <p className="side-panel-title">Chess Memory<br/>Game</p>
                </Link>
                <nav className="side-panel-nav">
                    <NavLink 
                        onClick={handleLinkClicked}
                        to="play" 
                        className={({isActive}) => isActive ? "side-panel-nav-link side-panel-nav-link-active" : "side-panel-nav-link"}
                    >
                        Play
                    </NavLink>
                    <NavLink 
                        onClick={handleLinkClicked}
                        to="about" 
                        className={({isActive}) => isActive ? "side-panel-nav-link side-panel-nav-link-active" : "side-panel-nav-link"}
                    >
                        About
                    </NavLink>
                </nav>
            </div>
            <footer>© Jego Merckx 2026</footer>
        </section>
    )
}