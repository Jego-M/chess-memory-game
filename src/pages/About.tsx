import type { ReactNode } from "react"

export default function About() {
    return (
        <section id="about-section">
            <Faq 
                question="What is this app?"
                answer={
                    <>
                        A fun little chess game meant to improve your (and my) chess ability. I created it as a practice project to put my <a href="https://react.dev/" target="_blank">React</a> skills to the test.
                    </>
                }
            />
            <Faq
                question="Is it free?"
                answer={
                    <>
                        Yes, 100% free. The <a href="https://github.com/Jego-M/chess-memory-game" target="_blank">source code</a> is also completely open, so you can modify/redistribute it to your hearts content.
                    </>
                }
            />
            <Faq
                question="Why does it look like Chess.com?"
                answer={
                    <>
                        Because I really like how <a href="https://www.chess.com" target="_blank">Chess.com</a> looks and feels! The color, font, sound and pieces come straight from their <a href="https://brandguide.neuedeutsche.com/" target="_blank">brand guide</a>. Note that this app is not affiliated with them in any way, shape or form.
                    </>
                }
            />
        </section>
    )
}

type FaqProps = {
    question: string,
    answer: ReactNode
}

function Faq({question, answer}: FaqProps) {
    return (
        <div className="faq">
            <p className="faq-question">{question}</p>
            <p className="faq-answer">{answer}</p>
        </div>
    )
}