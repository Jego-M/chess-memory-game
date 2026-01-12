import StartNewGame from "../components/StartNewGame";
import Game from "../components/Game.tsx"
import GameOver from "../components/GameOver.tsx"
import { useRef, useState } from "react";
import type { Difficulty } from "../game/types.ts";
type GameState = "pregame" | "ingame" | "postgame"

export default function Play() {

    const [difficulty, setDifficulty] = useState<Difficulty>("easy")
    const [gameState, setGameState] = useState<GameState>("pregame")
    const correctCount = useRef(0)
    const accuracy = useRef(0)

    function startNewGame(diff: Difficulty) {
        setDifficulty(diff);
        setGameState("ingame")
    }

    function restartGame(){
        setGameState("ingame")
    }

    function showStartingPanel() {
        setGameState("pregame")
    }

    function handleGameLost(correct: number, acc: number) {
        correctCount.current = correct
        accuracy.current = acc
        setGameState("postgame")
    }

    return (
        <section id="play-section">
        {
            gameState === "pregame" ? <StartNewGame onStart={startNewGame}/> :
            gameState === "ingame" ? <Game onGameOver={handleGameLost} difficulty={difficulty} /> :
            gameState === "postgame" ? <GameOver correctCount={correctCount.current} accuracy={accuracy.current} onStartNewGame={restartGame} onChangeDifficulty={showStartingPanel}/> : null
        }
        </section>
    )
}