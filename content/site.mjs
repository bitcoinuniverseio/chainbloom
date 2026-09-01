/**
 * The shape of the ChainBloom documentation: where it lives, how it is
 * grouped, which journeys it offers, and the words it defines.
 *
 * Page order and section membership come from each page's front matter. This
 * file only describes the containers.
 */

export const SITE = {
  name: 'ChainBloom',
  origin: 'https://bitcoinuniverseio.github.io',
  basePath: '/chainbloom',
  docsPath: '/chainbloom/docs',
  appUrl: 'https://inscribe.bitcoinuniverse.io/chainbloom',
  repoUrl: 'https://github.com/bitcoinuniverse/chainbloom',
  tagline: 'Grow a shared history with Bitcoin.',
  socialImage: '/chainbloom/assets/chainbloom-og.png',
};

export const SECTIONS = [
  {
    id: 'start',
    title: 'Start here',
    blurb: 'Understand ChainBloom, then pick the path that matches what you want to do.',
    tier: 'participant',
    icon: 'seed',
  },
  {
    id: 'learn',
    title: 'How it works',
    blurb: 'Worlds, paths, the five actions, and the part Bitcoin plays.',
    tier: 'participant',
    icon: 'growth',
  },
  {
    id: 'participate',
    title: 'Take part',
    blurb: 'Create, join, return, complete, and stay safe while you do it.',
    tier: 'participant',
    icon: 'hand',
  },
  {
    id: 'examples',
    title: 'Example worlds',
    blurb: 'Eight worlds worked out end to end, from invitation to last confirmed moment.',
    tier: 'participant',
    icon: 'garden',
  },
  {
    id: 'audiences',
    title: 'For you',
    blurb: 'The shortest useful route through ChainBloom for who you are.',
    tier: 'participant',
    icon: 'people',
  },
  {
    id: 'programs',
    title: 'Public programs',
    blurb: 'Exhibitions, classrooms, moderation, privacy, and access.',
    tier: 'participant',
    icon: 'building',
  },
  {
    id: 'reference',
    title: 'Technical reference',
    blurb: 'The protocol, its data, its rules, and the packages that implement it.',
    tier: 'reference',
    icon: 'code',
  },
  {
    id: 'help',
    title: 'Help',
    blurb: 'Answers, error messages, words, and what is running today.',
    tier: 'participant',
    icon: 'help',
  },
];

/**
 * The "Start here" picker. Each journey answers one question -- what do you
 * want to do -- and produces an ordered checklist the reader can keep.
 */
export const JOURNEYS = [
  {
    id: 'explore',
    label: 'Explore a world',
    summary: 'See what a shared history looks like before you spend anything.',
    detail: 'No wallet, no transaction, no cost. About 10 minutes.',
    icon: 'eye',
    steps: [
      'start/chainbloom-in-60-seconds',
      'learn/how-a-world-grows',
      'start/watch-a-world-grow',
      'examples/collaborative-garden',
      'learn/confirmed-and-unconfirmed',
    ],
  },
  {
    id: 'join',
    label: 'Join a world',
    summary: 'Add your own moment to a story someone else began.',
    detail: 'You will need a Bitcoin wallet and a small amount of bitcoin.',
    icon: 'bloom',
    steps: [
      'start/chainbloom-in-60-seconds',
      'learn/worlds-paths-and-history',
      'participate/join-a-world',
      'participate/wallet-and-review',
      'participate/fees-and-confirmation',
      'participate/protect-your-path',
      'participate/return-to-a-path',
    ],
  },
  {
    id: 'create',
    label: 'Create a world',
    summary: 'Write the invitation other people will answer.',
    detail: 'Plan the arc first. The choices you make at the start cannot be edited later.',
    icon: 'seed',
    steps: [
      'learn/how-a-world-grows',
      'learn/the-five-actions',
      'participate/create-a-world',
      'participate/fees-and-confirmation',
      'programs/moderation-and-privacy',
      'participate/complete-a-path',
    ],
  },
  {
    id: 'integrate',
    label: 'Build an integration',
    summary: 'Read, verify, or build ChainBloom transactions in your own product.',
    detail: 'TypeScript package, CLI, and test vectors.',
    icon: 'code',
    steps: [
      'reference/protocol-architecture',
      'reference/transaction-lifecycle',
      'reference/sdk',
      'reference/cli',
      'reference/validation-rules',
      'reference/test-vectors',
      'reference/integration-wallets',
    ],
  },
  {
    id: 'infrastructure',
    label: 'Run infrastructure',
    summary: 'Index the chain and serve the same history everyone else sees.',
    detail: 'Bitcoin Core, deterministic replay, and reorganization handling.',
    icon: 'server',
    steps: [
      'reference/protocol-architecture',
      'reference/data-structures',
      'reference/validation-rules',
      'reference/reorganizations',
      'reference/indexer-requirements',
      'reference/reliability',
    ],
  },
  {
    id: 'cultural',
    label: 'Host a cultural experience',
    summary: 'Run a world as an exhibition, festival, classroom, or public program.',
    detail: 'Planning, care of participants, and what to say out loud.',
    icon: 'building',
    steps: [
      'start/why-chainbloom-exists',
      'programs/organizations',
      'programs/education',
      'programs/moderation-and-privacy',
      'programs/accessibility',
      'examples/museum-exhibition',
    ],
  },
];

/**
 * Words the documentation defines once and links everywhere. `short` appears
 * in the inline tooltip; `long` appears in the glossary page.
 */
export const GLOSSARY = [
  {
    term: 'world',
    short: 'A bounded shared story with a fixed number of paths and a known ending.',
    long: 'A world is created by one transaction. It fixes how many paths exist, how long the world stays open, and how many steps each path may take. Everything that happens inside the world descends from that first transaction.',
    related: ['path', 'ruleset'],
  },
  {
    term: 'path',
    short: 'One thread inside a world that moves forward one confirmed step at a time.',
    long: 'A path is called a lane in the code and the API. Each path holds exactly one live Bitcoin output. Adding to the path spends that output and creates the next one, so the order of a path can never be disputed.',
    related: ['carrier', 'step', 'world'],
  },
  {
    term: 'carrier',
    short: 'The single small Bitcoin output that holds a path in place.',
    long: 'A carrier is a Taproot output worth exactly 1,000 satoshis. Whoever controls it controls what happens next on that path. Spending it outside a ChainBloom action ends the path for good.',
    related: ['path', 'outpoint', 'taproot'],
  },
  {
    term: 'bloom',
    short: 'One creative moment added to a path.',
    long: 'A bloom carries a glyph, a palette, a motion, and a magnitude. Those four numbers are the whole shared record. How a gallery draws, plays, or animates them is left open on purpose.',
    related: ['glyph', 'palette', 'step'],
  },
  {
    term: 'echo',
    short: 'A step that points back to an earlier confirmed moment.',
    long: 'An echo is called a graft in the code. It moves a path forward and names an earlier event as its reference, which is how quoting, answering, and homage become part of the record.',
    related: ['bloom', 'event'],
  },
  {
    term: 'meeting',
    short: 'One transaction where two paths share a moment and both continue.',
    long: 'A meeting is called a rendezvous in the code. It spends the live output of two paths and creates one successor for each, so the paths acknowledge each other without merging, swapping, or trading anything.',
    related: ['path', 'carrier'],
  },
  {
    term: 'close',
    short: 'The deliberate ending of one path.',
    long: 'A close spends the path’s carrier and creates no successor. The path stays in the history and can still be read, but it can never be extended again.',
    related: ['path', 'expired'],
  },
  {
    term: 'step',
    short: 'One confirmed move along a path.',
    long: 'Every bloom, echo, and meeting counts as one step for the path it advances. A world sets the maximum number of steps a path may take when it is created.',
    related: ['path', 'world'],
  },
  {
    term: 'event',
    short: 'One confirmed ChainBloom transaction, read as part of a world.',
    long: 'An event records which operation happened, which paths it touched, which output it consumed, which output it created, and the block that confirmed it.',
    related: ['confirmation', 'txid'],
  },
  {
    term: 'marker',
    short: 'The short piece of data in a transaction that says what the action is.',
    long: 'The marker is a single OP_RETURN output at index 0 carrying at most 72 bytes: the letters CBLM, a version, a network, an operation, a length, and the operation’s fields.',
    related: ['op-return', 'opcode'],
  },
  {
    term: 'op-return',
    short: 'A Bitcoin output that stores a small amount of data and holds no value.',
    long: 'OP_RETURN outputs are the standard way to attach data to a Bitcoin transaction. ChainBloom uses exactly one, at output index 0, worth zero satoshis.',
    related: ['marker'],
  },
  {
    term: 'opcode',
    short: 'The single byte that names which of the five actions a marker describes.',
    long: 'Create is 0x01, bloom is 0x02, echo (graft) is 0x03, meeting (rendezvous) is 0x04, and close is 0x05. Any other value is not a ChainBloom action.',
    related: ['marker'],
  },
  {
    term: 'outpoint',
    short: 'The address of one specific Bitcoin output: a transaction id and an index.',
    long: 'Written as txid:vout. A path is identified at any moment by the outpoint of its live carrier.',
    related: ['carrier', 'txid', 'utxo'],
  },
  {
    term: 'utxo',
    short: 'A Bitcoin output that has been created and not yet spent.',
    long: 'Short for unspent transaction output. Bitcoin balances are really a collection of these. A ChainBloom path is one of them, held apart from ordinary spending.',
    related: ['carrier', 'outpoint'],
  },
  {
    term: 'txid',
    short: 'The 64-character identifier of a Bitcoin transaction.',
    long: 'A transaction id is the fingerprint of a transaction. Keep it for any contribution that matters to you: it is what lets anyone check the moment on a Bitcoin explorer.',
    related: ['event', 'explorer'],
  },
  {
    term: 'confirmation',
    short: 'A transaction being included in a Bitcoin block.',
    long: 'Confirmation is what turns a provisional contribution into shared history. Until then everybody may see something slightly different; afterwards everybody sees the same order.',
    related: ['block-height', 'mempool'],
  },
  {
    term: 'block-height',
    short: 'The number of the block a transaction was confirmed in.',
    long: 'Bitcoin adds a block roughly every ten minutes, so height also works as a clock. A world’s duration is measured in blocks, not in days.',
    related: ['confirmation'],
  },
  {
    term: 'mempool',
    short: 'Where a broadcast transaction waits before it is confirmed.',
    long: 'A transaction in the mempool is a preview. It can be replaced, dropped, or confirmed in a different order than it arrived.',
    related: ['confirmation', 'rbf'],
  },
  {
    term: 'rbf',
    short: 'Replace by fee: re-sending a waiting transaction with a higher fee.',
    long: 'ChainBloom transactions are built so they can be replaced while they wait. That is why an unconfirmed contribution is never treated as settled.',
    related: ['mempool', 'fee-rate'],
  },
  {
    term: 'fee-rate',
    short: 'What you pay Bitcoin miners per unit of transaction size.',
    long: 'Measured in satoshis per virtual byte. A higher rate usually confirms sooner. The fee goes to Bitcoin miners; ChainBloom takes nothing.',
    related: ['mempool', 'satoshi'],
  },
  {
    term: 'satoshi',
    short: 'The smallest unit of bitcoin: one hundred millionth of one bitcoin.',
    long: 'Every ChainBloom carrier is exactly 1,000 satoshis. That amount is not a price or a deposit; it is the smallest practical output that can carry a path forward.',
    related: ['carrier', 'fee-rate'],
  },
  {
    term: 'taproot',
    short: 'The current standard type of Bitcoin output, written as P2TR.',
    long: 'ChainBloom carriers must be Taproot outputs, which keeps every path the same shape and makes them easy for software to recognise.',
    related: ['carrier'],
  },
  {
    term: 'psbt',
    short: 'A part-signed Bitcoin transaction: a draft your wallet can review and sign.',
    long: 'Partially signed Bitcoin transaction. ChainBloom tools build one for you so your wallet can show exactly what will be spent before any key is used.',
    related: ['carrier'],
  },
  {
    term: 'reorganization',
    short: 'Bitcoin replacing its most recent blocks with a different branch.',
    long: 'Reorganizations are normal and usually shallow. ChainBloom views drop the events on the replaced branch and replay the new one, so every honest view lands on the same history again.',
    related: ['confirmation', 'indexer'],
  },
  {
    term: 'indexer',
    short: 'A service that reads Bitcoin blocks and rebuilds ChainBloom worlds from them.',
    long: 'Any indexer following the same rules reconstructs the same worlds. That is what stops a single website from owning the history.',
    related: ['reorganization', 'explorer'],
  },
  {
    term: 'explorer',
    short: 'A public website for looking up Bitcoin transactions and blocks.',
    long: 'An explorer is independent of ChainBloom. Checking a transaction id there is the simplest way to confirm that a moment really happened.',
    related: ['txid'],
  },
  {
    term: 'glyph',
    short: 'One of the shape choices carried by a bloom.',
    long: 'A number from 0 to 31. It names a shape without describing how the shape looks, which is what lets two galleries draw the same bloom differently and both be right.',
    related: ['bloom', 'palette'],
  },
  {
    term: 'palette',
    short: 'One of the colour choices carried by a bloom.',
    long: 'A number from 0 to 15. Like a glyph, it is a reference rather than a picture.',
    related: ['bloom', 'glyph'],
  },
  {
    term: 'seed',
    short: 'Sixteen random bytes chosen when a world is created.',
    long: 'A world seed gives every gallery the same starting point for arranging a world, so two independent views can look related without coordinating. It is unrelated to a wallet seed phrase and holds no secret.',
    related: ['world'],
  },
  {
    term: 'ruleset',
    short: 'The version of the rules a world was created under.',
    long: 'A world records which ruleset it follows so future changes can never quietly redefine a story that is already finished.',
    related: ['world'],
  },
  {
    term: 'expired',
    short: 'What a path becomes when its world runs past its last block.',
    long: 'Expiry is not failure. It is the ending the creator chose when the world began, and the history stays readable afterwards.',
    related: ['world', 'close'],
  },
  {
    term: 'abandoned',
    short: 'A path that ended because its carrier was spent outside ChainBloom.',
    long: 'If a confirmed transaction spends a live carrier without being a valid ChainBloom action, the path stops there. Nothing is invented to replace it.',
    related: ['carrier', 'path'],
  },
];
