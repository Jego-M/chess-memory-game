import type { Piece } from "../game/types"
import PieceIcon from "./PieceIcon"
import { useDraggable } from "@dnd-kit/core"

type Props = {
    piece: Piece
}

export default function BarPiece({piece}: Props) {
    
    const id = `bar:${piece}`

    const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
        id,
        data: {
            source: "bar",
            piece
        }
    })

    return (
        <div className={`bar-piece ${isDragging ? "is-dragging" : ""}`} ref={setNodeRef} {...listeners} {...attributes}>
        {
            <PieceIcon piece={piece} />
        }
        </div>
    )
}