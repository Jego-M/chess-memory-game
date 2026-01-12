import { useState } from "react"
import type { Difficulty } from "../game/types.ts"
import InfoTooltip from "./InfoTooltip"
import { STARTING_PIECE_COUNT_EASY, STARTING_PIECE_COUNT_HARD, STARTING_PIECE_COUNT_MEDIUM, WRONG_PIECES_LOSE_THRESHOLD } from "../game/gameConfig.ts"

type Props = {
  onStart: (difficulty: Difficulty) => void;
}


export default function StartNewGame({ onStart } : Props){

    const [chosenDifficulty, setChosenDifficulty] = useState<Difficulty>("easy")

    return (
        <section className="start-new-game-panel">
            <h1 className="start-new-game-title">Select mode</h1>
            <div className="start-new-game-difficulty-container">
                <button className={`start-new-game-button ${chosenDifficulty === "easy" ? "start-new-game-button-active" : ""}`} onClick={() => setChosenDifficulty("easy")}>
                    Easy
                    <InfoTooltip label={`Starts with ${STARTING_PIECE_COUNT_EASY} pieces. Game ends after reaching ${WRONG_PIECES_LOSE_THRESHOLD} mistakes.`} >
                        <div className="info-button small">?</div>
                    </InfoTooltip>
                </button>
                <button className={`start-new-game-button ${chosenDifficulty === "medium" ? "start-new-game-button-active" : ""}`} onClick={() => setChosenDifficulty("medium")}>
                    Medium
                    <InfoTooltip label={`Starts with ${STARTING_PIECE_COUNT_MEDIUM} pieces. Game ends after reaching ${WRONG_PIECES_LOSE_THRESHOLD} mistakes.`} >
                        <div className="info-button small">?</div>
                    </InfoTooltip>
                </button>
                <button className={`start-new-game-button ${chosenDifficulty === "hard" ? "start-new-game-button-active" : ""}`} onClick={() => setChosenDifficulty("hard")}>
                    Hard
                    <InfoTooltip label={`Starts with ${STARTING_PIECE_COUNT_HARD} pieces. Game ends after reaching ${WRONG_PIECES_LOSE_THRESHOLD} mistakes.`} >
                        <div className="info-button small">?</div>
                    </InfoTooltip>
                </button>
            </div>
            <button className="start-new-game-start-button" onClick={() => onStart(chosenDifficulty)}>
                Start
            </button>
        </section>
    )
}