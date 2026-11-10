export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string; by?: string }
  | { type: 'figure'; number: string; caption: string }
  | { type: 'list'; items: string[] }

export interface Article {
  slug: string
  title: string
  accent: string // italic serif part of the title
  dek: string
  category: 'Design' | 'Sound' | 'Studio notes'
  date: string
  read: string
  tint: string
  body: Block[]
}

export const ARTICLES: Article[] = [
  {
    slug: 'seven-hours-on-the-mill',
    title: 'Seven hours',
    accent: 'on the mill',
    dek: 'Why each ear cap starts as a solid block of aluminium, and why we still finish it by hand.',
    category: 'Design',
    date: 'August 2026',
    read: '4 min read',
    tint: '#2a2118',
    body: [
      { type: 'p', text: 'Every SONA One cap begins as a block of aluminium about the size of a matchbox. It weighs 61 grams. By the time it leaves the mill it weighs nine.' },
      { type: 'p', text: 'We could have cast it. Casting is faster and cheaper, and most people would never know. But a cast part has tiny pockets of air inside it, and those pockets ring when sound hits them. You hear it as a faint brightness on cymbals. Once you notice it, you keep noticing it.' },
      { type: 'h', text: 'Cutting away the noise' },
      { type: 'p', text: 'A milled part is dense all the way through. The cap sits right behind the driver, so it matters more than almost any other surface. Seven hours on a five-axis mill takes it down to a wall 0.8 millimetres thin, which is about the thickness of a credit card.' },
      { type: 'figure', number: '0.8 mm', caption: 'Final wall thickness of the cap, measured at twelve points before it is approved.' },
      { type: 'p', text: 'Then it goes to Mira. She brushes each cap by hand on a slow wheel, in circles, for about four minutes. A machine can do this in forty seconds. It also leaves a pattern that looks like a machine did it.' },
      { type: 'quote', text: 'You are not polishing it. You are giving the light somewhere to go.', by: 'Mira, finishing' },
      { type: 'h', text: 'What it costs' },
      { type: 'p', text: 'Milling adds about eleven dollars to every pair. We looked for ways to take it out and kept putting it back. It is the first thing your hand touches and the last thing you hear before the music. We think it has earned the eleven dollars.' },
    ],
  },
  {
    slug: 'how-quiet-is-made',
    title: 'How quiet',
    accent: 'is made',
    dek: 'Noise cancelling, explained without the diagrams. What the eight microphones are actually doing.',
    category: 'Sound',
    date: 'July 2026',
    read: '5 min read',
    tint: '#141b26',
    body: [
      { type: 'p', text: 'Sound is air moving back and forth. A plane engine pushes the air in a slow, heavy rhythm. If you could push back at exactly the same moment, with exactly the same force, the air would barely move at all. That is the whole trick.' },
      { type: 'p', text: 'The hard part is exactly. Push a fraction too late and you add noise instead of removing it. So SONA One listens constantly, with six microphones facing the world and two facing your ear.' },
      { type: 'h', text: 'Outside and inside' },
      { type: 'p', text: 'The outside microphones hear the noise before it reaches you. The inside ones hear what actually made it through the cushion, which changes with your hair, your glasses and how the headphones sit today. The chip compares the two and corrects itself many thousands of times a second.' },
      { type: 'figure', number: '−38 dB', caption: 'Reduction of a steady 200 Hz drone, the pitch of most aircraft cabins.' },
      { type: 'h', text: 'Why voices still get through' },
      { type: 'p', text: 'Low, steady sounds are easy to cancel because they are predictable. Voices are not. They start and stop and jump in pitch. That is where the cushions take over. Good passive sealing does most of the work above 1 kHz, which is why we spent so long on the foam.' },
      { type: 'list', items: ['Engines, trains and air conditioning: mostly cancelled electronically', 'Voices and keyboards: mostly blocked by the cushions', 'Sudden sounds like a door: softened, never fully removed'] },
      { type: 'p', text: 'We tuned it so the silence never feels like pressure. Some headphones cancel so aggressively that your ears feel blocked. We backed ours off by two decibels. You lose almost nothing, and you can wear them for a whole flight.' },
    ],
  },
  {
    slug: 'the-cushion-that-took-a-year',
    title: 'The cushion',
    accent: 'that took a year',
    dek: 'Forty-one foams, three leathers and one very patient test head called Otto.',
    category: 'Studio notes',
    date: 'May 2026',
    read: '4 min read',
    tint: '#231416',
    body: [
      { type: 'p', text: 'Otto is a silicone head with microphones where his ears should be. He sits on a shelf in the studio and wears prototypes for up to twelve hours a day. He has never once complained, which makes him the easiest member of the team.' },
      { type: 'p', text: 'We tested forty-one foams on him. Most were either too soft, so the seal leaked bass, or too firm, so real people took them off after an hour. The one we chose recovers slowly, about three seconds, which lets it settle around glasses without pressing them into your head.' },
      { type: 'figure', number: '41', caption: 'Foam formulations tested before we settled on one.' },
      { type: 'h', text: 'Leather that breathes' },
      { type: 'p', text: 'Nappa is soft, but a thin protein coating on the surface is what stops it feeling sticky on a warm day. We tried three tanneries before one could hold that coating even across a whole hide.' },
      { type: 'quote', text: 'We stopped asking whether it sounded right and started asking whether people forgot they were wearing it.', by: 'Jonas, acoustics' },
      { type: 'h', text: 'Made to be replaced' },
      { type: 'p', text: 'Cushions wear out first on every pair of headphones. Ours are held on by magnets, so a new pair takes a second to fit. Send the old ones back and we turn the foam into packaging for the next pair.' },
    ],
  },
]

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug)
