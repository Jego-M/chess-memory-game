export type Difficulty = "easy" | "medium" | "hard"

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Square = `${File}${Rank}`

export type Piece =
    | "wP" | "wN" | "wB" | "wR" | "wQ" | "wK"
    | "bP" | "bN" | "bB" | "bR" | "bQ" | "bK"

export type PieceCount = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

export type PositionMap = Record<Square, Piece | null>