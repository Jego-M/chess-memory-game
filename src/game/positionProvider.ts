import type { PieceCount } from "./types"
import p3 from "../assets/positions/positions_3.json"
import p4 from "../assets/positions/positions_4.json"
import p5 from "../assets/positions/positions_5.json"
import p6 from "../assets/positions/positions_6.json"
import p7 from "../assets/positions/positions_7.json"
import p8 from "../assets/positions/positions_8.json"
import p9 from "../assets/positions/positions_9.json"
import p10 from "../assets/positions/positions_10.json"
import p11 from "../assets/positions/positions_11.json"
import p12 from "../assets/positions/positions_12.json"
import p13 from "../assets/positions/positions_13.json"
import p14 from "../assets/positions/positions_14.json"
import p15 from "../assets/positions/positions_15.json"


const POSITIONS: Record<PieceCount, string[]> = {
  3: p3,
  4: p4,
  5: p5,
  6: p6,
  7: p7,
  8: p8,
  9: p9,
  10: p10,
  11: p11,
  12: p12,
  13: p13,
  14: p14,
  15: p15,
}

const decks = new Map<PieceCount, string[]>()

export function nextPlacement(count: PieceCount): string {
  const base = POSITIONS[count]
  if (!base?.length) throw new Error(`No positions for piece count ${count}`)

  const deck = decks.get(count)
  if (!deck || deck.length === 0) {
    const shuffled = [...base].sort(() => Math.random() - 0.5)
    decks.set(count, shuffled)
  }
  return decks.get(count)!.pop()!
}
