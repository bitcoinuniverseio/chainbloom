---
title: Educators
nav: Educators
description: What a class actually learns by running a ChainBloom world (shared state, ordering, irreversibility, and collaboration), plus the real limits on cost, consent, age, and keys.
updated: 2026-07-31
order: 7
keywords: [teacher, classroom, lesson plan, curriculum, students, consent, keys]
related: [programs/education, examples/classroom-constellation, participate/fees-and-confirmation]
cta:
  title: Set up a class world
  body: Group sizes, choice of network, key handling, and a session that fits a timetable.
  label: Read Education
  href: /docs/programs/education
---

:::lead
Most lessons about shared ledgers are diagrams on a board. A ChainBloom [[world]] is a diagram the class is standing inside: thirty people, one history, and rules that refuse to bend when a student wants them to. The refusals are the lesson.
:::

## Four things it teaches by being used

### Shared state

Every student sees the same world because no server decides what it is. Two students replaying the same blocks build the same history in the same order, down to the sort order of the list. Nobody has a private copy that counts more.

### Ordering

A [[step]] joins the history at the block that confirms it, not at the moment a student pressed the button. Two students who act within the same minute may land in either order, and neither of them picks. This is where "the network decides" stops being a phrase and becomes something a fifteen-year-old will argue about.

One rule makes the point sharply. A step is rejected with `UNCONFIRMED_LINEAGE_PARENT` when the previous step on that same path is not already confirmed in an earlier block. You cannot add to your own path twice in one block. You wait, like everyone else.

### Irreversibility

A confirmed step cannot be edited, hidden, or withdrawn: not by the teacher, not by the school, not by us. There is a harsher version too: if a path's output is spent by an ordinary payment instead of a ChainBloom action, that path is marked [[abandoned]] with the reason `INVALID_CONFIRMED_SPEND`, and nothing is invented to replace it. The thread stops there, in public, permanently.

That is hard to teach with a worksheet. Say it before the lesson, not after.

### Collaboration

Paths do not merge. When two paths meet, both carry on as themselves. They share a moment rather than being flattened into one. Students used to a shared document where the loudest editor wins notice the difference straight away.

## The practical limits

**Group size.** A world has {{MIN_LANES}} to {{MAX_LANES}} paths. A class of thirty is therefore several worlds, or teams of four sharing one path. Teams sharing a path is usually the better lesson, because the group has to agree before anyone signs.

**Cost.** Every contribution pays a real Bitcoin network fee to miners, and each live path holds {{CARRIER_VALUE_SATS}} satoshis in its [[carrier]] output until the path is completed. There is no free tier on mainnet. Read [Fees and confirmation](/docs/participate/fees-and-confirmation) before you promise anything to a head of department.

The protocol also defines testnet4, signet, and regtest alongside mainnet, and both the library and the `chainbloom` command take a network flag. Rehearse there. Run the graded exercise there too if the budget is nil. The mechanics are identical; what differs is that the coins are not real.

**Keys.** Students should not hold keys. A key lost by a fourteen-year-old is a path that ends where it stopped, and a shared school device is not a place to keep one. Have the teacher sign, or have each team dictate its move to the person who signs. Never ask a student to type a recovery phrase into anything.

**Consent and age.** Everything a world records is public and permanent. The good news is that there is almost nothing personal to leak: the only free text is the world's title, at most {{MAX_TITLE_BYTES}} characters. Every contribution after that is numbers: glyph, palette, motion, magnitude. Do not put a student's name in a title. Get guardian consent for whatever you publish alongside the world, such as photographs or a class list, because that part is yours to protect, not Bitcoin's.

:::safety
Wallet control is not proof of authorship. If a student's contribution matters to them, the record of who made what is the class register you keep. The chain records the step, not the person.
:::

## A first session that fits an hour

:::checklist id=classroom-first-session
- Pick a non-mainnet network and run the whole flow yourself before the lesson
- Split the class into at most {{MAX_LANES}} teams and give each team one path
- Agree out loud what a bloom means in this world before anyone acts
- Have two teams act at nearly the same time, then look at which one confirmed first
- Let one team try to act twice in a row and read the `UNCONFIRMED_LINEAGE_PARENT` error together
- Finish by completing one path on purpose, so the class sees an ending they chose
:::

Next: [A classroom constellation](/docs/examples/classroom-constellation) is a full worked world: the invitation, the group sizes, and how the last lesson ends.
