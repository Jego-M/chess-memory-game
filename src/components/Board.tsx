import type { PositionMap } from "../game/types"
import { ALL_SQUARES } from "../game/utility"
import SquareView from "./SquareView"

type Props = {
    positionMap: PositionMap,
    isRememberPhase: boolean
}

export default function Board({positionMap, isRememberPhase}: Props) {

    return (
        <div className={`chessboard ${isRememberPhase ? "remember" : ""}`}>
        {
            ALL_SQUARES.map((square)=> {
                return (
                    <SquareView key={square} square={square} piece={positionMap[square]} remember={isRememberPhase}/>
                )
            })
        }
        </div>
    )
}