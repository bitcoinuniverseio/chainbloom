---
title: Education and classroom use
nav: Education
description: How to run a ChainBloom world across a school or university term: what it teaches, consent and age, who holds the keys, what it costs per student, and a version that spends nothing at all.
socialTitle: ChainBloom in the classroom
socialDescription: A term-length shape, a lesson plan, key custody, cost per student, and a no-transaction version.
updated: 2026-07-31
order: 3
keywords: [education, classroom, school, university, teaching, lesson plan, students, consent]
related: [audiences/educators, examples/classroom-constellation, programs/moderation-and-privacy]
cta:
  title: Before the first student contributes
  body: What a confirmed record reveals about the person who made it, and what a teacher can and cannot take back.
  label: Moderation and privacy
  href: /docs/programs/moderation-and-privacy
---

:::lead
A ChainBloom [[world]] is one of the few classroom exercises where the thing being taught and the thing being made are the same object. Students learn what confirmation means by waiting for one. This page gives you a term-length shape, the consent questions to settle first, honest costs, and a version that spends nothing.
:::

## What it actually teaches

Not "blockchain". Something narrower and more useful.

- **Order without a referee.** Every student's step lands somewhere in one sequence that nobody administers. There is no teacher's copy of the record that outranks anyone else's. That idea is hard to teach with a slide and easy to teach with a waiting room.
- **Irreversibility as a design constraint.** Students draft, revise and delete constantly. A confirmed [[step]] cannot be revised or deleted by anyone. Making something under that rule changes how carefully people choose.
- **Reading a transaction.** A ChainBloom marker is at most {{MAX_MARKER_BYTES}} bytes, with an {{HEADER_BYTES}}-byte header carrying the magic value {{PROTOCOL_MAGIC}}, a version, a network, an operation and a payload length. Students can decode one by hand and see that there is no magic in it.
- **Constraint as a creative tool.** A contribution is a handful of small numbers: a [[glyph]] index, a [[palette]] index, a motion value, a magnitude. Deciding what those should mean in your class is the real assignment.
- **Collaboration without erasure.** Two paths can meet and both continue. Nobody's line gets absorbed into a group average.

## A term-length shape

A world's duration is fixed at creation, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}} blocks, which is roughly {{MIN_DURATION_DAYS}} day to {{MAX_DURATION_DAYS}} days. About {{MIN_DURATION_BLOCKS}} blocks arrive per day, so a twelve-week term is in the region of twelve thousand blocks. Set it longer than the term and finish the paths deliberately in the last session.

A workable structure for a class of about twenty-four:

- Six paths, four students per path, so a path is a small group rather than an individual. The protocol allows up to {{MAX_LANES}}.
- A step limit well under {{MAX_MAX_STEPS}}. One step per group per week is plenty and keeps the cost predictable.
- One session in the middle of term where two groups arrange a meeting between their paths. That session is where the coordination lesson lives.
- A final session where every path is completed on purpose.

:::note
A path can only advance once per block, because a step whose parent event is in the same block is rejected with `UNCONFIRMED_LINEAGE_PARENT`. Twenty-four students cannot all contribute to one path in one lesson. Plan around parallel paths, not a queue.
:::

Run the class on a test network rather than mainnet unless you have a reason not to. The network is part of the marker, and the validation rules reject any attempt to mix them with `NETWORK_MISMATCH`, so a test world and a mainnet world can never be confused with each other.

:::generated name=networks-table
:::

## Consent, age and what ends up public

Settle these before a single transaction is built, because none of them can be settled afterwards.

**Nothing a student writes can be removed.** There is no takedown, no right-to-erasure mechanism, and no administrator with a delete button. If your institution's data policy cannot accommodate that, run the no-transaction version below.

**The only free text is the world title.** Student contributions are numbers, not words. A bloom carries a glyph, a palette, a motion and a magnitude, and nothing else. The one place text appears is the world's title, which is at most {{MAX_TITLE_BYTES}} ASCII bytes matching {{TITLE_PATTERN}}. The teacher writes it, once, and it is public forever. Do not put a student's name, a class code, or a school identifier in it.

**Timing is data.** Every event carries the [[block height]] it confirmed in. A term of weekly steps published from the same address is a visible timetable. That is fine for a class project and worth saying out loud to students, because it is the kind of thing nobody notices until later.

**Consent should be informed and specific.** Tell students, in writing, that the record is permanent, public, and outside the school's control; that the address that signs is linkable across every step it takes; and that their name appears only where the school chooses to put it. For under-18s, get the same consent from a parent or guardian, and keep the school as the signer.

[Community moderation and participant privacy](/docs/programs/moderation-and-privacy) goes further into what a confirmed contribution reveals.

## Who holds the keys

The school does. Not the students.

There is one wallet for the class, controlled by the teacher or the department, funding every path in the world. Students decide what the step should be; the teacher builds, reviews and signs it. This is not a compromise for convenience. It is the correct arrangement.

- Students never handle a private key or a seed phrase, so there is nothing for them to lose and nothing for the school to be responsible for losing.
- One wallet means one budget and one place to check the fee before signing.
- If a student later wants their own wallet, they can learn that separately, with their own money, away from the assessed work.

:::safety
Use a wallet dedicated to this class and nothing else. A wallet that does not understand ChainBloom can spend a [[carrier]] output as ordinary change. If that spend confirms, the path becomes abandoned with the reason `INVALID_CONFIRMED_SPEND`, and nothing replaces it. Do not fund the class from the same wallet as anything else.
:::

## What it costs per student

Two components, and only one of them is actually spent.

**Held, not spent.** Each live path holds {{CARRIER_VALUE_SATS}} satoshis in its carrier output. That amount moves forward at every step and comes back when the path is completed. Six paths hold six times {{CARRIER_VALUE_SATS}} satoshis for the length of the term, and you get it back at the end.

**Spent.** A miner fee on every transaction. That is the number to budget. Its size depends on the fee rate at the moment you sign, so the honest way to plan is per transaction rather than per student.

Count the transactions before the term starts:

- one to create the world
- one per step, per path, per week
- one to complete each path at the end

A term with six paths, ten weekly steps each and a final completion is sixty-seven transactions. Multiply by your assumed fee per transaction, add margin, and that is the whole chain budget. Divide by the class size if your finance office wants a per-student figure. [Fees and confirmation](/docs/participate/fees-and-confirmation) explains how to read the fee before you sign rather than after.

:::warning
Never present the fee as an investment, a deposit, or something that grows. It is a payment to Bitcoin miners for including a transaction, in the same way postage pays for delivery. Students will ask whether it is worth anything. The answer is no.
:::

## The lesson plan

A six-session sketch that fits either a half-term or a compressed unit.

### One: the idea, no chain

Show a finished world as an ordered list of events. Ask what a shared history without an owner would mean for something the students already argue about. No wallets, no software.

### Two: decode a marker by hand

Give each pair a hex string and have them find the magic value, the version, the network, the operation and the payload. Then check their answer with `chainbloom marker decode --hex <hex>`. The gap between "it is just bytes" and "it is a protocol" closes in about twenty minutes.

### Three: write the invitation

Groups design their own world on paper: path count, duration, step limit, and what a glyph and a palette will mean in their world. Collect these; pick one; explain why.

### Four: create and take the first steps

The teacher creates the world at the start of the session so it has time to confirm. Groups choose their first step; the teacher signs; the class watches for confirmation. The waiting is the lesson.

### Five: the meeting

Two groups negotiate a meeting between their paths. They have to agree on the moment, and the transaction needs both carriers in one transaction. [When paths meet](/docs/learn/when-paths-meet) is the reading.

### Six: endings

Each group decides how its path should finish and why, and the paths are completed on purpose. Compare the finished world to the paper design from session three.

:::checklist id=classroom-setup
- Confirm the institution's data policy allows a permanent public record you cannot withdraw.
- Choose the network for the class and write it into the lesson materials.
- Create a wallet used only for this class, and note who else in the department can sign.
- Fund it and write down the ceiling you will not exceed on any single transaction.
- Draft the consent letter covering permanence, publicity and address linkability.
- Collect consent from guardians for any student under 18.
- Choose the path count, the duration in blocks with margin past the last session, and the step limit.
- Write the world title with no student name, class code or school identifier in it.
- Decide what a glyph, a palette and a motion mean in this class, and write it on the wall.
- Create the world at least one session before the first student step.
- Book time in the final session to complete every path deliberately.
- Record the world id, the network, the seed and the event list in the department's own archive.
:::

## The version that spends nothing

You can teach almost all of this without a single transaction. This is the right default for a first run, for a large cohort, or for any institution still deciding its policy.

Take a confirmed history and read it. `chainbloom state replay -n <network> -f <path>` walks a file of blocks and prints the resulting state as JSON: the worlds, the paths, their statuses, and the events in order. Students can see a path go live, take steps, meet another path and end, without anybody spending anything.

The published [test vectors](/docs/reference/test-vectors) work the same way. `chainbloom vectors verify` checks the five valid and six invalid marker vectors that ship with the project and prints `Verified 5 valid and 6 invalid marker vectors.` The invalid ones are the interesting half of the lesson: a truncated header, a wrong magic value, a reserved network, a reserved operation, a trailing byte, and a glyph outside its range. Each one is a small, precise argument about why a rule exists.

Then discuss the artefact. Which step changed the direction of a path? Was the meeting a good idea? Should that path have ended sooner? These are ordinary critique questions, and the record answers them the same way for every student in the room.

:::note
There are no public worlds to browse today, because the index that would serve them is not switched on. See [what is running](/docs/help/status). Until that changes, the reading material for a no-transaction class is the shipped vectors, a replay file you prepare, or a world your own department has created.
:::
