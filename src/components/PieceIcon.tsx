import type { Piece } from "../game/types"

import WP from "../assets/webp/pieces/wp.webp"
import WN from "../assets/webp/pieces/wn.webp"
import WB from "../assets/webp/pieces/wb.webp"
import WR from "../assets/webp/pieces/wr.webp"
import WQ from "../assets/webp/pieces/wq.webp"
import WK from "../assets/webp/pieces/wk.webp"
import BP from "../assets/webp/pieces/bp.webp"
import BN from "../assets/webp/pieces/bn.webp"
import BB from "../assets/webp/pieces/bb.webp"
import BR from "../assets/webp/pieces/br.webp"
import BQ from "../assets/webp/pieces/bq.webp"
import BK from "../assets/webp/pieces/bk.webp"

const SOURCES: Record<Piece, string> = {
  wP: WP,
  wN: WN,
  wB: WB,
  wR: WR,
  wQ: WQ,
  wK: WK,
  bP: BP,
  bN: BN,
  bB: BB,
  bR: BR,
  bQ: BQ,
  bK: BK
}

type Props = {
    piece: Piece
}

export default function PieceIcon({piece} : Props) {
  const source = SOURCES[piece]
  return <img src={source} className="piece" aria-label={piece} />
}
