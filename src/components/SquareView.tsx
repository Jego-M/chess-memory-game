import type { Piece, Square } from "../game/types"
import BoardPiece from "./BoardPiece"
import { useDroppable } from "@dnd-kit/core"
import { GameContext } from "./Game"
import { useContext } from "react"
import CorrectImg from "../assets/webp/correct.webp"

type Props = {
    piece: Piece | null,
    square: Square,
    remember: boolean
}

export default function SquareView(props : Props) {

    const contextValue = useContext(GameContext)
    const isWrong = contextValue.wrongSquares.includes(props.square)
    const valueInMissingSquares = contextValue.missingSquares[props.square]
    let missingPiece = null
    if (valueInMissingSquares !== undefined && valueInMissingSquares !== null)
        missingPiece = valueInMissingSquares

    function isDarkSquare() {
      const file = props.square[0]
      const rank = Number(props.square[1])
      const fileIndex = "abcdefgh".indexOf(file)
      return (fileIndex + rank) % 2 === 1
    }

    const isDark = isDarkSquare();

    const { setNodeRef } = useDroppable({id: props.square})

    const wrongOrMissed = missingPiece ? "missed" : isWrong ? "wrong" : null
    const correct = contextValue.correctSquares.includes(props.square)
    const remember = props.remember ? "remember" : null

    return (
        <div className={`square ${isDark ? "dark" : "light"} ${wrongOrMissed} ${remember}`} ref={setNodeRef}>
        {
            props.square[0] === "a" ? <p className={`square-rank-indicator ${isDark ? "ligth" : "dark"} ${isWrong ? "wrong" : ""}`}>{props.square[1]}</p> : null    
        }
        {
            props.square[1] === "1" ? <p className={`square-file-indicator ${isDark ? "ligth" : "dark"} ${isWrong ? "wrong" : ""}`}>{props.square[0]}</p> : null 
        }
        {
            missingPiece ? <BoardPiece piece={missingPiece} square={props.square} missed={missingPiece !== null}/> :
            props.piece ? <BoardPiece piece={props.piece} square={props.square} /> : 
            null
        }
        {
            correct ? <img className="square-correct-icon" src={CorrectImg} alt={"Correct Icon"} /> : null
        }
        </div>
    )
}