import { create } from 'zustand'
import { BASE_PRICE, type EnvId } from '../lib/constants'

export type PartId = 'shell' | 'cap' | 'cushion' | 'band' | 'pad' | 'frame'
export type MaterialId = 'polymer' | 'aluminium' | 'steel' | 'ceramic' | 'leather' | 'knit'
export type ColorId =
  | 'obsidian'
  | 'graphite'
  | 'silver'
  | 'bone'
  | 'sand'
  | 'champagne'
  | 'oxblood'
  | 'midnight'
  | 'sage'
  | 'amber'

export interface PartConfig {
  material: MaterialId
  color: ColorId
}

export type ProductConfig = Record<PartId, PartConfig>

export const COLORS: Record<ColorId, { label: string; hex: string }> = {
  obsidian: { label: 'Obsidian', hex: '#141416' },
  graphite: { label: 'Graphite', hex: '#3a3b3f' },
  silver: { label: 'Silver', hex: '#c9cbce' },
  bone: { label: 'Bone', hex: '#e4ddd0' },
  sand: { label: 'Sand', hex: '#bba98c' },
  champagne: { label: 'Champagne', hex: '#d9c09a' },
  oxblood: { label: 'Oxblood', hex: '#5c1d22' },
  midnight: { label: 'Midnight', hex: '#1d2940' },
  sage: { label: 'Sage', hex: '#7f8d78' },
  amber: { label: 'Amber', hex: '#e0913a' },
}

export const MATERIALS: Record<MaterialId, { label: string; note: string }> = {
  polymer: { label: 'Soft-touch polymer', note: 'Matte, warm to hold' },
  aluminium: { label: 'Anodised aluminium', note: 'Cool, finely brushed' },
  steel: { label: 'Stainless steel', note: 'Polished to a mirror' },
  ceramic: { label: 'Glazed ceramic', note: 'Deep gloss, hard to scratch' },
  leather: { label: 'Nappa leather', note: 'Soft, warms to your skin' },
  knit: { label: 'Recycled knit', note: 'Breathes on long listens' },
}

export const PARTS: Record<
  PartId,
  { label: string; materials: MaterialId[]; colors: ColorId[]; premium: Partial<Record<MaterialId, number>> }
> = {
  shell: {
    label: 'Ear cups',
    materials: ['polymer', 'aluminium', 'ceramic'],
    colors: ['obsidian', 'graphite', 'silver', 'bone', 'oxblood', 'midnight', 'sage', 'amber'],
    premium: { aluminium: 30, ceramic: 70 },
  },
  cap: {
    label: 'Caps',
    materials: ['aluminium', 'steel', 'polymer', 'ceramic'],
    colors: ['graphite', 'silver', 'champagne', 'obsidian', 'bone', 'amber'],
    premium: { steel: 20, ceramic: 40 },
  },
  cushion: {
    label: 'Cushions',
    materials: ['leather', 'knit'],
    colors: ['obsidian', 'graphite', 'bone', 'sand', 'oxblood', 'midnight', 'sage'],
    premium: { leather: 25 },
  },
  band: {
    label: 'Headband',
    materials: ['aluminium', 'polymer', 'steel'],
    colors: ['graphite', 'silver', 'champagne', 'obsidian', 'bone', 'oxblood', 'midnight'],
    premium: { aluminium: 15, steel: 35 },
  },
  pad: {
    label: 'Canopy',
    materials: ['knit', 'leather'],
    colors: ['obsidian', 'graphite', 'bone', 'sand', 'oxblood', 'midnight', 'sage'],
    premium: { leather: 20 },
  },
  frame: {
    label: 'Frame',
    materials: ['steel', 'aluminium'],
    colors: ['silver', 'graphite', 'champagne', 'obsidian'],
    premium: {},
  },
}

export const PART_ORDER: PartId[] = ['shell', 'cap', 'cushion', 'band', 'pad', 'frame']

export const LOOKS = {
  graphite: {
    label: 'Graphite',
    blurb: 'Soft greys that go with everything.',
    tint: '#16171a',
    config: {
      shell: { material: 'polymer', color: 'graphite' },
      cap: { material: 'aluminium', color: 'graphite' },
      cushion: { material: 'leather', color: 'obsidian' },
      band: { material: 'aluminium', color: 'graphite' },
      pad: { material: 'knit', color: 'graphite' },
      frame: { material: 'steel', color: 'silver' },
    },
  },
  bone: {
    label: 'Bone',
    blurb: 'Linen tones and a glint of champagne.',
    tint: '#2a2621',
    config: {
      shell: { material: 'polymer', color: 'bone' },
      cap: { material: 'aluminium', color: 'champagne' },
      cushion: { material: 'leather', color: 'sand' },
      band: { material: 'aluminium', color: 'champagne' },
      pad: { material: 'knit', color: 'bone' },
      frame: { material: 'steel', color: 'champagne' },
    },
  },
  oxblood: {
    label: 'Oxblood',
    blurb: 'Deep red leather, like a good armchair.',
    tint: '#2a1215',
    config: {
      shell: { material: 'polymer', color: 'oxblood' },
      cap: { material: 'aluminium', color: 'champagne' },
      cushion: { material: 'leather', color: 'oxblood' },
      band: { material: 'aluminium', color: 'obsidian' },
      pad: { material: 'leather', color: 'oxblood' },
      frame: { material: 'steel', color: 'champagne' },
    },
  },
  midnight: {
    label: 'Midnight',
    blurb: 'Navy knit and steel for late trains.',
    tint: '#111a2b',
    config: {
      shell: { material: 'aluminium', color: 'midnight' },
      cap: { material: 'steel', color: 'silver' },
      cushion: { material: 'knit', color: 'midnight' },
      band: { material: 'steel', color: 'silver' },
      pad: { material: 'knit', color: 'midnight' },
      frame: { material: 'steel', color: 'silver' },
    },
  },
  sage: {
    label: 'Sage',
    blurb: "Pale green glaze, like a potter's bowl.",
    tint: '#1c221b',
    config: {
      shell: { material: 'ceramic', color: 'sage' },
      cap: { material: 'aluminium', color: 'silver' },
      cushion: { material: 'knit', color: 'sand' },
      band: { material: 'aluminium', color: 'silver' },
      pad: { material: 'knit', color: 'sand' },
      frame: { material: 'aluminium', color: 'silver' },
    },
  },
  arctic: {
    label: 'Arctic',
    blurb: 'All silver, like a winter morning.',
    tint: '#1d2024',
    config: {
      shell: { material: 'aluminium', color: 'silver' },
      cap: { material: 'steel', color: 'silver' },
      cushion: { material: 'leather', color: 'bone' },
      band: { material: 'steel', color: 'silver' },
      pad: { material: 'knit', color: 'bone' },
      frame: { material: 'steel', color: 'silver' },
    },
  },
  ember: {
    label: 'Ember',
    blurb: 'Amber glaze on black. A slow burn.',
    tint: '#2b1a0d',
    config: {
      shell: { material: 'ceramic', color: 'amber' },
      cap: { material: 'aluminium', color: 'obsidian' },
      cushion: { material: 'leather', color: 'obsidian' },
      band: { material: 'polymer', color: 'obsidian' },
      pad: { material: 'knit', color: 'obsidian' },
      frame: { material: 'aluminium', color: 'graphite' },
    },
  },
  noir: {
    label: 'Noir',
    blurb: 'Black on black. Not a single glint.',
    tint: '#0c0c0e',
    config: {
      shell: { material: 'polymer', color: 'obsidian' },
      cap: { material: 'ceramic', color: 'obsidian' },
      cushion: { material: 'leather', color: 'obsidian' },
      band: { material: 'polymer', color: 'obsidian' },
      pad: { material: 'leather', color: 'obsidian' },
      frame: { material: 'aluminium', color: 'obsidian' },
    },
  },
} satisfies Record<string, { label: string; blurb: string; tint: string; config: ProductConfig }>

export type LookId = keyof typeof LOOKS
export const LOOK_IDS = Object.keys(LOOKS) as LookId[]

export function priceOf(config: ProductConfig) {
  let price = BASE_PRICE
  for (const part of PART_ORDER) {
    price += PARTS[part].premium[config[part].material] ?? 0
  }
  return price
}

export function matchLook(config: ProductConfig): LookId | null {
  for (const id of LOOK_IDS) {
    const look = LOOKS[id].config as ProductConfig
    if (PART_ORDER.every((p) => look[p].material === config[p].material && look[p].color === config[p].color)) return id
  }
  return null
}

/* URL (de)serialisation: ?shell=aluminium.graphite&cap=... or ?look=bone */
export function configToSearch(config: ProductConfig) {
  const look = matchLook(config)
  if (look) return `?look=${look}`
  const params = new URLSearchParams()
  for (const p of PART_ORDER) params.set(p, `${config[p].material}.${config[p].color}`)
  return `?${params.toString()}`
}

export function configFromSearch(search: string): ProductConfig | null {
  const params = new URLSearchParams(search)
  const look = params.get('look') as LookId | null
  if (look && look in LOOKS) return structuredClone(LOOKS[look].config) as ProductConfig
  let touched = false
  const config = structuredClone(LOOKS.graphite.config) as ProductConfig
  for (const p of PART_ORDER) {
    const raw = params.get(p)
    if (!raw) continue
    const [material, color] = raw.split('.') as [MaterialId, ColorId]
    if (PARTS[p].materials.includes(material) && color in COLORS) {
      config[p] = { material, color }
      touched = true
    }
  }
  return touched ? config : null
}

export type FocusId = PartId | 'overview'

interface ConfiguratorState {
  config: ProductConfig
  env: EnvId
  autoRotate: boolean
  focus: FocusId
  activePart: PartId
  captureRequest: number
  setPart: (part: PartId, value: Partial<PartConfig>) => void
  setLook: (look: LookId) => void
  setConfig: (config: ProductConfig) => void
  setEnv: (env: EnvId) => void
  setAutoRotate: (v: boolean) => void
  setActivePart: (p: PartId) => void
  setFocus: (f: FocusId) => void
  requestCapture: () => void
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  config: structuredClone(LOOKS.graphite.config) as ProductConfig,
  env: 'soft',
  autoRotate: false,
  focus: 'overview',
  activePart: 'shell',
  captureRequest: 0,
  setPart: (part, value) =>
    set((s) => {
      const next = { ...s.config[part], ...value }
      if (!PARTS[part].materials.includes(next.material)) next.material = PARTS[part].materials[0]
      return { config: { ...s.config, [part]: next } }
    }),
  setLook: (look) => set({ config: structuredClone(LOOKS[look].config) as ProductConfig }),
  setConfig: (config) => set({ config }),
  setEnv: (env) => set({ env }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setActivePart: (activePart) => set({ activePart, focus: activePart }),
  setFocus: (focus) => set({ focus }),
  requestCapture: () => set((s) => ({ captureRequest: s.captureRequest + 1 })),
}))