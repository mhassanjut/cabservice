import type { HomeLocationCard } from '~/data/homeContent'

const GRID_COLS = 4

export type HomeLocationCardLayout = HomeLocationCard & {
  columnSpan: 1 | 2 | 4
}

function baseColumnSpan(card: HomeLocationCard): number {
  return card.wide ? 2 : 1
}

function distributeExtraSpan(count: number, remaining: number, baseSpans: number[]): number[] {
  const extras = new Array<number>(count).fill(0)

  if (remaining <= 0) {
    return extras
  }

  if (count === 1) {
    extras[0] = remaining
    return extras
  }

  if (count === 2 && remaining === 2) {
    return [1, 1]
  }

  let left = remaining
  let index = 0

  while (left > 0) {
    if (baseSpans[index]! + extras[index]! < GRID_COLS) {
      extras[index]! += 1
      left -= 1
    }

    index = (index + 1) % count
  }

  return extras
}

/** Pack transfer cards into a 4-column bento grid; expands the last row to avoid trailing gaps. */
export function layoutLocationCards(cards: HomeLocationCard[]): HomeLocationCardLayout[] {
  if (cards.length === 0) {
    return []
  }

  const baseSpans = cards.map(baseColumnSpan)
  let columnCursor = 0
  let lastRowStartIndex = 0

  for (let index = 0; index < cards.length; index += 1) {
    const span = baseSpans[index]!

    if (columnCursor + span > GRID_COLS) {
      lastRowStartIndex = index
      columnCursor = 0
    }

    columnCursor += span

    if (columnCursor === GRID_COLS) {
      columnCursor = 0

      if (index + 1 < cards.length) {
        lastRowStartIndex = index + 1
      }
    }
  }

  if (columnCursor === 0) {
    return cards.map((card, index) => ({
      ...card,
      columnSpan: (baseSpans[index] === 2 ? 2 : 1) as 1 | 2 | 4,
    }))
  }

  const remaining = GRID_COLS - columnCursor
  const lastRowCount = cards.length - lastRowStartIndex
  const lastRowBaseSpans = baseSpans.slice(lastRowStartIndex)
  const extraSpans = distributeExtraSpan(lastRowCount, remaining, lastRowBaseSpans)

  return cards.map((card, index) => {
    if (index < lastRowStartIndex) {
      return {
        ...card,
        columnSpan: (baseSpans[index] === 2 ? 2 : 1) as 1 | 2 | 4,
      }
    }

    const lastRowIndex = index - lastRowStartIndex
    const finalSpan = baseSpans[index]! + extraSpans[lastRowIndex]!

    return {
      ...card,
      columnSpan: Math.min(finalSpan, GRID_COLS) as 1 | 2 | 4,
    }
  })
}
