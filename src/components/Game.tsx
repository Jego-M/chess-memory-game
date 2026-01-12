import { useEffect, useState, useRef, createContext } from "react"
import type { PositionMap, Difficulty, Piece, Square, PieceCount } from "../game/types"
import { ALL_SQUARES, clamp, emptyBoard, placementToPositionMap } from "../game/utility"
import { nextPlacement } from "../game/positionProvider"
import Board from "./Board"
import ControlPanel from "./ControlPanel"
import PiecesBar from "./PiecesBar"
import { pointerWithin, DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core"
import PieceIcon from "./PieceIcon"
import { snapCenterToCursor } from "@dnd-kit/modifiers"
import RememberBar from "./RememberBar"
import { AVERAGE_ACCURACY_PROGRESS_PERCENTAGE, LEVEL_PROGRESSION_MIN_POSITIONS, REMEMBER_TIME_PER_PIECE, STARTING_PIECE_COUNT_EASY, STARTING_PIECE_COUNT_HARD, STARTING_PIECE_COUNT_MEDIUM, TIME_AT_WHICH_TO_PLAY_TIMER_SOUND, WRONG_PIECES_LOSE_THRESHOLD } from "../game/gameConfig"
import { playSfx } from "../game/sfx"
import Toggle from "./Toggle"
import AudioOnIcon from "../assets/svg/audio-on.svg?react"
import AudioOffIcon from "../assets/svg/audio-off.svg?react"
import { loadAudioEnabled, saveAudioEnabled } from "../game/audioPrefs"

type Props = {
    difficulty: Difficulty,
    onGameOver: (correctCount: number, accuracy: number) => void
}

type DragData = 
    | {source: "bar", piece: Piece}
    | {source: "board", fromSquare: Square, piece: Piece}

type Phase =
    | "init"
    | "remember"
    | "place"
    | "evaluate"
    | "gameOver"

type EvaluateResult = {
    correct: number,
    incorrect: number
}

const GameContext = createContext({
    canDrag: false,
    correctSquares: [] as Square[],
    wrongSquares: [] as Square[],
    missingSquares: {} as Partial<Record<Square, Piece | null>>,
})

export { GameContext }

export default function Game(props: Props) {
    const [positionMap, setPositionMap] = useState<PositionMap>(emptyBoard)
    const [activePiece, setActivePiece] = useState<Piece | null>(null);
    const [phase, setPhase] = useState<Phase>("init")

    const [correctSquares, setCorrectSquares] = useState<Square[]>([])
    const [wrongSquares, setWrongSquares] = useState<Square[]>([])
    const [missingSquares, setMissingSquares] = useState<Partial<Record<Square, Piece | null>>>({})
    const [correctCount, setCorrectCount] = useState(0)
    const [incorrectCount, setIncorrectCount] = useState(0)
    const [level, setLevel] = useState(1)
    const [levelResults, setLevelResults] = useState<EvaluateResult[]>([])

    const rememberPhaseStartTime = useRef<number | undefined>(undefined)
    const animationLoopId = useRef<number | undefined>(undefined)
    const progressBarRef = useRef<HTMLDivElement | null>(null)
    const moveSound = useRef("moveA")
    const hasPlayedTimerSound = useRef(false)
    const isFirstPosition = useRef(true)
    const totalCorrect = useRef(0)
    const totalIncorrect = useRef(0)
    const playAudio = useRef(loadAudioEnabled(true))
    const hadCorrectThisPosition = useRef(false)
    const hadWrongThisPosition = useRef(false)
    const correctPositionMap = useRef<PositionMap>(emptyBoard())
    const pieceCount = useRef<PieceCount>(3)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {activationConstraint: {delay: 120, tolerance: 4}})
    )

    useEffect(() => {

        if (phase === "init") {

            if (playAudio.current)
                playSfx("gameStart")
 
            const newPieceCount = 
                props.difficulty === "easy" ? STARTING_PIECE_COUNT_EASY
                : props.difficulty === "medium" ? STARTING_PIECE_COUNT_MEDIUM
                : STARTING_PIECE_COUNT_HARD
            pieceCount.current = newPieceCount
            setLevel(1)
            setLevelResults([])

            setPhase("remember")
        }

        if (phase === "remember") {

            if (isFirstPosition.current)
                isFirstPosition.current = false
            else if (playAudio.current)
                playSfx("remember")

            let pieces = pieceCount.current
            if (levelResults.length >= LEVEL_PROGRESSION_MIN_POSITIONS) {
                const accuracy = getLevelAccuracy(levelResults)
                if (accuracy !== undefined && accuracy >= AVERAGE_ACCURACY_PROGRESS_PERCENTAGE) {
                    setLevel(prev => prev + 1)
                    pieceCount.current = clamp(pieceCount.current + 1, 3, 18) as PieceCount
                    setLevelResults([])

                    // Also need to manually update pieces
                    pieces = clamp(pieces + 1, 3, 18) as PieceCount
                }
            }

            const randomPlacement = nextPlacement(pieces)
            const randomMap = placementToPositionMap(randomPlacement)
            setPositionMap(randomMap)
            correctPositionMap.current = randomMap
            setCorrectSquares([])
            setWrongSquares([])
            setMissingSquares({})
            rememberPhaseStartTime.current = undefined
            hasPlayedTimerSound.current = false

            const animId = requestAnimationFrame(handleRememberPhaseAnimationLoop)
            animationLoopId.current = animId
        }

        if (phase === "place") {
            if (playAudio.current)
                playSfx("place")
            setPositionMap(emptyBoard)
        }

        if (phase === "evaluate") {
            let correct = 0
            let incorrect = 0

            const correctSquares = [] as Square[]
            const wrongSquares = [] as Square[]
            const missing = {} as Partial<Record<Square, Piece | null>>

            for (const square of ALL_SQUARES){
                if (positionMap[square] !== correctPositionMap.current[square]) {
                    wrongSquares.push(square)
                    incorrect++

                    if (positionMap[square] === null) {
                        missing[square] = correctPositionMap.current[square]
                    }
                } else if (correctPositionMap.current[square] !== null) {
                    correct++
                    correctSquares.push(square)
                }
            }

            setCorrectCount(prev => prev + correct)
            setIncorrectCount(prev => prev + incorrect)
            setCorrectSquares(correctSquares)
            setWrongSquares(wrongSquares)
            setMissingSquares(missing)
            setLevelResults(prev => {
                return [...prev, { correct, incorrect }]
            })
            totalCorrect.current += correct
            totalIncorrect.current += incorrect
            hadCorrectThisPosition.current = correct > 0
            hadWrongThisPosition.current = incorrect > 0

            if (playAudio.current) {
                if (correct > 0)
                    playSfx("correct")
                else
                    playSfx("wrong")
            }
        }

        return () => {
            cancelAnimationLoop()
        }
    }, [phase])


    function handleDragStart(e: DragStartEvent) {
        if (phase !== "place") return
        const data = e.active.data.current as DragData | undefined
        if (data?.source === "bar")
            setActivePiece(data.piece)
    }

    function handleDragEnd(e: DragEndEvent) {
        if (phase !== "place") return
        const data = e.active.data.current as DragData | undefined
        const overId = e.over?.id

        setActivePiece(null)

        if (!data) return

        if (data.source === "bar") {
            if (!overId) return
            const square = overId as Square

            const isReplacingPiece = positionMap[square] !== null

            setPositionMap((prev) => ({
                ...prev,
                [square]: data.piece
            }))

            if (playAudio.current) {
                if (isReplacingPiece) {
                    playSfx("capture")
                } else {
                    playMoveSound()
                }
            }

            return
        }

        if (data.source ==="board") {
            const fromSquare = data.fromSquare

            if(!overId) {
                setPositionMap((prev) => ({
                    ...prev,
                    [fromSquare]: null
                }))
                return
            }
            
            const toSquare = overId as Square
            if (toSquare === fromSquare) return

            const isReplacingPiece = positionMap[toSquare] !== null

            setPositionMap((prev) => {
                const next = { ...prev }
                next[fromSquare] = null
                next[toSquare] = data.piece
                return next
            })

            if (playAudio.current) {
                if (isReplacingPiece) {
                    playSfx("capture")
                } else {
                    playMoveSound()
                }
            }
        }
    }

    function handleDragCancel(){
        setActivePiece(null)
    }

    function playMoveSound(){
        if (!playAudio.current) return
        if (moveSound.current === "moveA") {
            playSfx("moveA")
            moveSound.current = "moveB"
        } else {
            playSfx("moveB")
            moveSound.current = "moveA"
        }
    }

    function cancelAnimationLoop() {
        if (animationLoopId.current === undefined) return
        cancelAnimationFrame(animationLoopId.current)
        animationLoopId.current = undefined
    }

    function handleRememberPhaseAnimationLoop(timeStamp: number) {

        if (phase !== "remember") {
            animationLoopId.current = undefined
            return
        }

        // If first time animation loop is called
        if (rememberPhaseStartTime.current === undefined){
            rememberPhaseStartTime.current = timeStamp
            progressBarRef.current?.style.setProperty("--pct", String(0));
            const animId = requestAnimationFrame(handleRememberPhaseAnimationLoop)
            animationLoopId.current = animId
            return
        }

        // Already called, so i should be able to measure progress
        const elapsedTime = timeStamp - rememberPhaseStartTime.current
        const timeToWait = pieceCount.current * REMEMBER_TIME_PER_PIECE

        if (!hasPlayedTimerSound.current && elapsedTime >= TIME_AT_WHICH_TO_PLAY_TIMER_SOUND) {
            if (playAudio.current)
                playSfx("timer")
            hasPlayedTimerSound.current = true
        }

        if (elapsedTime >= timeToWait) {
            // Finished countdown, should stop
            animationLoopId.current = undefined
            setPhase("place")
            return
        }
        
        // So, just measure progress from 0 to 1 and set it somewhere
        const normalizedProgress = Math.min(1, Math.max(0, elapsedTime / timeToWait))
        progressBarRef.current?.style.setProperty("--pct", String(normalizedProgress))
        const animId = requestAnimationFrame(handleRememberPhaseAnimationLoop)
        animationLoopId.current = animId
    }

    function handleRememberBarContinueClicked() {
        if (phase !== "remember") return
        cancelAnimationLoop()
        setPhase("place")
    }

    function handleEvaluateClicked() {
        if (phase !== "place") return
        setPhase("evaluate")
    }

    function handleNextClicked() {
        if (phase !== "evaluate") return

        if (incorrectCount >= WRONG_PIECES_LOSE_THRESHOLD){
            if (playAudio.current)
                playSfx("gameEnd")
            const totalMoves = totalCorrect.current + totalIncorrect.current
            const accuracy = totalMoves === 0 ? 0 : Math.round((totalCorrect.current / totalMoves) * 100)
            props.onGameOver(correctCount, accuracy)
        } else {
            setPhase("remember")
        }
    }

    function getLevelAccuracy(results: EvaluateResult[]): number | undefined {
        if (results.length === 0) return undefined
        const { correct, incorrect } = results.reduce(
            (acc, r) => ({
              correct: acc.correct + r.correct,
              incorrect: acc.incorrect + r.incorrect,
            }),
            { correct: 0, incorrect: 0 }
        );
        const total = correct + incorrect
        return Math.round(total === 0 ? 0 : (correct / total) * 100)
    }

    function handleAudioToggle() {
        playAudio.current = !playAudio.current
        saveAudioEnabled(playAudio.current)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[snapCenterToCursor]}
            >
                <GameContext.Provider value={{canDrag: phase === "place", correctSquares, wrongSquares, missingSquares}}>
                    <div className="game-wrapper">
                        <div className="chessboard-and-pieces-bar-wrapper">
                            <div className="audio-toggle-wrapper">
                                <Toggle isOnByDefault={playAudio.current} onToggle={handleAudioToggle} onIcon={<AudioOnIcon/>} offIcon={<AudioOffIcon/>}/>
                            </div>
                            <Board positionMap={positionMap} isRememberPhase={phase === "remember"} />
                            {
                                phase === "remember" ? <RememberBar progressBarRef={progressBarRef} onContinue={handleRememberBarContinueClicked}/> : null
                            }
                            <PiecesBar show={phase === "place"}/>
                        </div>
                        <ControlPanel 
                            onEvaluate={phase === "place" ? handleEvaluateClicked : phase === "evaluate" ? handleNextClicked : () => {}} 
                            buttonText={phase === "place" ? "Evaluate" : "Next"}
                            showButton={phase === "place" || phase === "evaluate"}
                            correct={correctCount} 
                            incorrect={incorrectCount}
                            level={level}
                            accuracy={getLevelAccuracy(levelResults)}
                            animateCorrect={phase === "evaluate" && hadCorrectThisPosition.current}
                            animateWrong={phase === "evaluate" && hadWrongThisPosition.current}
                        />
                    </div>
                </GameContext.Provider>

            <DragOverlay dropAnimation={null}>
                {activePiece ? <PieceIcon piece={activePiece} /> : null}
            </DragOverlay>
        </DndContext>
    )
}