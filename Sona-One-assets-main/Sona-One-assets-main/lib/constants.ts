export const HDRIS = {
  soft: { label: 'Studio Soft', file: '/hdri/studio_small_09_1k.hdr', background: '#0d0d0f', floor: '#0d0d0f', intensity: 1 },
  dark: { label: 'Studio Dark', file: '/hdri/wooden_studio_16_1k.hdr', background: '#060607', floor: '#060607', intensity: 1.15 },
  mono: { label: 'Monochrome', file: '/hdri/monochrome_studio_02_1k.hdr', background: '#1a1a1d', floor: '#1a1a1d', intensity: 0.95 },
  day: { label: 'Daylight', file: '/hdri/white_studio_04_1k.hdr', background: '#d8d4cc', floor: '#d8d4cc', intensity: 0.9 },
} as const

export type EnvId = keyof typeof HDRIS

export const TEXTURES = {
  leatherNormal: '/textures/leather_normal.webp',
  leatherRough: '/textures/leather_rough.webp',
  knitNormal: '/textures/knit_normal.webp',
  knitRough: '/textures/knit_rough.webp',
} as const

export const INK = '#0a0a0b'

export const BASE_PRICE = 349

/** Primary pill navigation (desktop). Everything else lives in the full menu. */
export const ROUTES = [
  { to: '/', label: 'Overview' },
  { to: '/studio', label: 'Studio' },
  { to: '/listen', label: 'Listen' },
  { to: '/specs', label: 'Specs' },
  { to: '/shop', label: 'Shop' },
] as const

export const MENU = [
  {
    title: 'SONA One',
    links: [
      { to: '/', label: 'Overview' },
      { to: '/story', label: 'Story' },
      { to: '/listen', label: 'Listen' },
      { to: '/specs', label: 'Specs' },
      { to: '/lookbook', label: 'Lookbook' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { to: '/studio', label: 'Build yours' },
      { to: '/shop', label: 'Accessories' },
      { to: '/preorder', label: 'Pre-order' },
    ],
  },
  {
    title: 'SONA',
    links: [
      { to: '/about', label: 'About' },
      { to: '/journal', label: 'Journal' },
      { to: '/support', label: 'Support' },
    ],
  },
] as const

export const FREE_SHIPPING = 100