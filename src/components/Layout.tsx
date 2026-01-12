import { Outlet } from "react-router-dom"
import SidePanel from "./SidePanel"

export default function Layout() {
    return (
        <div className="site-wrapper">
            <SidePanel />
            <main>
                <Outlet />
            </main>
        </div>
    )
}