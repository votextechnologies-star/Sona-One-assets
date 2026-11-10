import type { LookId } from '../store/configurator'

/** Virtual (wheel/drag) scroll for the lookbook carousel. Mutable, frame-rate data only. */
export const lookbookState = {
  target: 0,
  current: 0,
  velocity: 0,
  dragging: false,
  moved: 0,
  centerIndex: 0,
  modalOpen: false,
  onSelect: null as null | ((id: LookId) => void),
}

export const CARD_W = 1.9
export const CARD_H = 2.45
export const CARD_GAP = 2.4