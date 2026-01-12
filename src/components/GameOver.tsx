import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

type Props = {
    correctCount: number,
    accuracy: number,
    onStartNewGame: () => void,
    onChangeDifficulty: () => void
}

export default function GameOver(props: Props) {
    const { width, height } = useWindowSize()
    const piecesText = props.correctCount === 1 ? "piece" : "pieces"
    return (
        <>
            <Confetti recycle={false} width={width} height={height} />
            <div className="game-over-panel">
                <h1>Game Over</h1>
                <h3>You got <span className="bold">{props.correctCount}</span> {piecesText} correct!</h3>
                <p>Your total accuracy was <span className="bold">{props.accuracy}%</span></p>
                <button className="new-game-button" onClick={props.onStartNewGame}>
                    New game
                </button>
                <button className="change-difficulty-button" onClick={props.onChangeDifficulty}>
                    Change difficulty
                </button>
            </div>
        </>
    )
}