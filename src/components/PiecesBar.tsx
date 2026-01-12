import { ALL_PIECES } from "../game/utility"
import BarPiece from "./BarPiece"

type Props = {
    show: boolean
}

export default function PiecesBar({show}: Props) {
    return (
        <div className={`pieces-bar ${show ? "" : "hide"}`}>
        {
            ALL_PIECES.map((piece) => {
                return <BarPiece key={piece} piece={piece} />
            })
        }
        </div>
    )
}