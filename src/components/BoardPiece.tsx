import type { Piece, Square } from "../game/types"
import PieceIcon from "./PieceIcon"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { GameContext } from "./Game"
import { useContext } from "react"

type Props = {
    piece: Piece,
    square: Square,
    missed?: boolean
}

export default function BoardPiece({piece, square, missed = false}: Props) {
    
    const contextValue = useContext(GameContext)

    const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
        id: `board:${square}`,
        disabled: !contextValue.canDrag,
        data: {
            source: "board",
            fromSquare: square,
            piece
        }
    })

    return (
        <div
            ref={setNodeRef}
            className={`board-piece ${isDragging ? "is-dragging" : ""} ${contextValue.canDrag ? "draggable" : ""} ${missed ? "missed" : ""}`}
            style={{ transform: CSS.Transform.toString(transform) }}
            {...listeners}
            {...attributes}
        >
            <PieceIcon piece={piece} />
        </div>
    )
}