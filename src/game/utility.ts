import type { File, Rank, Square, Piece, PositionMap } from "./types.ts"

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const satisfies readonly File[]
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const satisfies readonly Rank[]


export const ALL_SQUARES: Square[] = RANKS.flatMap((r) =>
    FILES.map((f) => `${f}${r}` as Square)
)

export const ALL_PIECES:Piece[] = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"]

export function emptyBoard(): PositionMap {
    const board = {} as PositionMap
    for (const square of ALL_SQUARES) {
      board[square] = null
    }
    return board
}

const PIECE_FROM_FEN: Record<string, Piece> = {
  P: "wP", N: "wN", B: "wB", R: "wR", Q: "wQ", K: "wK",
  p: "bP", n: "bN", b: "bB", r: "bR", q: "bQ", k: "bK",
}

const square = (file: typeof FILES[number], rank: typeof RANKS[number]) =>
  `${file}${rank}` as Square

export function placementToPositionMap(placement: string): PositionMap {
  const map = {} as PositionMap
  for (const r of RANKS) for (const f of FILES) map[square(f, r)] = null

  const rows = placement.split("/")
  if (rows.length !== 8) throw new Error(`Invalid placement: ${placement}`)

  for (let row = 0; row < 8; row++) {
    const rank = RANKS[row]
    let fileIndex = 0

    for (const ch of rows[row]) {
      if (ch >= "1" && ch <= "8") {
        fileIndex += Number(ch)
        continue
      }

      const piece = PIECE_FROM_FEN[ch]
      if (!piece) throw new Error(`Unknown piece char: ${ch}`)

      const file = FILES[fileIndex]
      if (!file) throw new Error(`Row too long in: ${placement}`)

      map[square(file, rank)] = piece
      fileIndex += 1
    }

    if (fileIndex !== 8) throw new Error(`Row too short in: ${placement}`)
  }

  return map
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}