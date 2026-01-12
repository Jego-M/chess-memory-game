import Counter from "./Counter"
import CorrectImg from "../assets/webp/correct.webp"
import IncorrectImg from "../assets/webp/incorrect.webp"
import InfoTooltip from "./InfoTooltip"
import { LEVEL_PROGRESSION_MIN_POSITIONS, AVERAGE_ACCURACY_PROGRESS_PERCENTAGE } from "../game/gameConfig"

type Props = {
    onEvaluate: () => void,
    correct: number,
    incorrect: number,
    buttonText: string,
    showButton: boolean,
    level: number,
    accuracy: number | undefined,
    animateCorrect: boolean,
    animateWrong: boolean,
}

export default function ControlPanel(props: Props) {
    return (
        <div className="control-panel">
            <div className="control-panel-top">
                <div className="counter-wrapper">
                    <Counter count={props.correct} imageSource={CorrectImg} imageAlt="Correct Icon" animation={props.animateCorrect ? "animate-correct" : ""}/>
                    <Counter count={props.incorrect} imageSource={IncorrectImg} imageAlt="Incorrect Icon" animation={props.animateWrong ? "animate-wrong" : ""}/>
                </div>
                <div className="difficulty-wrapper">
                    <div className="info-wrapper">
                        <InfoTooltip label={`The higher the level, the more pieces are shown in a position. Increase the level by reaching ${AVERAGE_ACCURACY_PROGRESS_PERCENTAGE}% or higher accuracy in the level. Minimum ${LEVEL_PROGRESSION_MIN_POSITIONS} positions per level.`} >
                            <button className="info-button">?</button>
                        </InfoTooltip>
                        <p>Level: <span className="bold">{props.level}</span></p>
                    </div>
                    <div className="info-wrapper">
                        <InfoTooltip label={`Your average accuracy in this level.`}>
                            <button className="info-button">?</button>
                        </InfoTooltip>
                        <p>Level Accuracy: {props.accuracy !== undefined ? <span className="bold">{props.accuracy}%</span> : "-"}</p>
                    </div>
                </div>
            </div>
            <button className={`control-panel-main-button ${props.showButton ? "" : "hidden"}`} onClick={props.onEvaluate}>
                {props.buttonText}
            </button>
        </div>
    )
}