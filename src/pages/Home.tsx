import { Link } from "react-router-dom"

export default function Home() {
    return (
        <section id="home-section">
            <h1 className="home-intro-title">
              Build a sharper mental chessboard
            </h1>
            <h3 className="home-intro-subtitle">
              Train your recall ability so that calculating variations feels easier and faster
            </h3>
            <p className="home-intro-body">
              Train the skill that sits underneath strong calculation: holding a position clearly in your mind. Each round starts by showing you a chess position for a few seconds. Your job is to take a mental snapshot before the board disappears, and to recreate the position.
              <br/><br/>
              Strong players can “see” the board while calculating without touching the pieces. This game is a simple way to strengthen that mental picture and your ability to reproduce it under pressure.
            </p>
            <Link to="play" className="home-play-button">
                Play
            </Link>
        </section>
    )
}