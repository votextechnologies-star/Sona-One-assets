/** Accessories catalog. Every item has a procedural 3D model in canvas/models/Accessories.tsx. */

export type AccessoryId = 'case' | 'cushions' | 'cable' | 'stand' | 'canopy'

export interface Variant {
  id: string
  label: string
  hex: string
}

export interface Accessory {
  id: AccessoryId
  name: string
  price: number
  line: string
  details: string[]
  variants: Variant[]
  badge?: string
}

export const ACCESSORIES: Accessory[] = [
  {
    id: 'case',
    name: 'Travel Case',
    price: 59,
    line: 'A soft shell that keeps its shape in a full bag.',
    details: ['Moulded recycled felt, knit cover', 'Folds flat when empty', 'Pocket for the cable'],
    variants: [
      { id: 'graphite', label: 'Graphite', hex: '#3a3b3f' },
      { id: 'sand', label: 'Sand', hex: '#bba98c' },
      { id: 'midnight', label: 'Midnight', hex: '#1d2940' },
    ],
    badge: 'New',
  },
  {
    id: 'cushions',
    name: 'Ear Cushions',
    price: 39,
    line: 'A fresh pair clicks on in a second. The old ones come back to us.',
    details: ['Magnetic, no tools', 'Slow-rebound memory foam', 'Returned pairs are recycled'],
    variants: [
      { id: 'obsidian', label: 'Obsidian', hex: '#141416' },
      { id: 'bone', label: 'Bone', hex: '#e4ddd0' },
      { id: 'oxblood', label: 'Oxblood', hex: '#5c1d22' },
      { id: 'sand', label: 'Sand', hex: '#bba98c' },
    ],
  },
  {
    id: 'cable',
    name: 'Braided Cable',
    price: 29,
    line: 'Lossless listening, and it charges while you play.',
    details: ['USB-C to USB-C, 1.5 m', 'Woven so it never tangles', '24-bit / 96 kHz audio'],
    variants: [
      { id: 'graphite', label: 'Graphite', hex: '#3a3b3f' },
      { id: 'amber', label: 'Amber', hex: '#e0913a' },
      { id: 'bone', label: 'Bone', hex: '#e4ddd0' },
    ],
  },
  {
    id: 'stand',
    name: 'Aluminium Stand',
    price: 89,
    line: 'Somewhere to put them down that looks intentional.',
    details: ['One piece of milled aluminium', 'Leather-lined rest', 'Weighted base, 640 g'],
    variants: [
      { id: 'silver', label: 'Silver', hex: '#c9cbce' },
      { id: 'graphite', label: 'Graphite', hex: '#3a3b3f' },
    ],
  },
  {
    id: 'canopy',
    name: 'Knit Canopy',
    price: 25,
    line: 'The part that touches your head, replaceable in a minute.',
    details: ['Recycled technical knit', 'Snaps into the frame', 'Machine washable cover'],
    variants: [
      { id: 'graphite', label: 'Graphite', hex: '#3a3b3f' },
      { id: 'sand', label: 'Sand', hex: '#bba98c' },
      { id: 'sage', label: 'Sage', hex: '#7f8d78' },
    ],
  },
]

export const accessoryById = (id: AccessoryId) => ACCESSORIES.find((a) => a.id === id)!