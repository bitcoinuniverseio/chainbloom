---
title: Community moderation and participant privacy
nav: Moderation and privacy
description: Nobody can remove a confirmed contribution from Bitcoin, so moderation happens before and around a world rather than after it — and a contribution reveals more than people expect.
socialTitle: Moderation and privacy in a ChainBloom world
socialDescription: Why deletion is impossible, where moderation actually works, and what an address, a block time and a title give away.
updated: 2026-07-31
order: 4
keywords: [moderation, privacy, safeguarding, takedown, pseudonymous, community, policy]
related: [programs/organizations, participate/protect-your-path, reference/security-model]
cta:
  title: Design the room for everyone
  body: Text alternatives, stills for motion, keyboard access, and cost explained in plain words.
  label: Accessibility for creative worlds
  href: /docs/programs/accessibility
---

:::lead
Start with the sentence nobody enjoys writing. A confirmed contribution cannot be removed from Bitcoin by you, by us, by the contributor, or by a court order served on any of us. Every moderation policy for a ChainBloom [[world]] has to be built around that fact rather than against it — and the good news is that the protocol makes the job much smaller than it sounds.
:::

## The hard part first

There is no delete. There is no edit. There is no takedown request that reaches the record.

Once a transaction confirms in a block, it is part of Bitcoin's history and stays there for as long as Bitcoin does. A ChainBloom [[event]] is an ordinary Bitcoin transaction, so it inherits that property completely. No host, no indexer operator, no protocol author and no institution has a lever that removes it.

What a host controls is everything except the record: who gets invited, what the invitation asks for, what a gallery chooses to display, and what a particular service shows in its own view. That is a real amount of control. It is just applied before and around the record instead of after it.

:::warning
If your organisation's policy requires the ability to withdraw a contribution on request, ChainBloom cannot meet it, and no amount of process design will change that. Say so early, in writing, to whoever signs off the programme.
:::

## What can actually carry a message

This is the fact that makes ChainBloom moderation unusually easy, and most people miss it.

**Participants cannot write text.** A contribution is a handful of small numbers and nothing else:

| Action | What the payload carries |
| --- | --- |
| Bloom | A [[glyph]] index up to {{MAX_GLYPH}}, a palette index up to {{MAX_PALETTE}}, a motion value up to {{MAX_MOTION}}, and a magnitude in one byte |
| Echo | The transaction id it points at, a relation up to {{MAX_RELATION}}, a glyph, a palette |
| Meeting | A bridge style up to {{MAX_BRIDGE_STYLE}}, a glyph, a palette, an intensity in one byte |
| Completion | A single reason byte |

There is no free-text field in any of them. Somebody joining your world cannot write a slur, a phone number, a link or a threat into their step, because there is nowhere to put one. The worst a contributor can do inside the protocol is choose a glyph you did not want next to another glyph.

**The one place text exists is the world's title**, written once by whoever creates the world, at most {{MAX_TITLE_BYTES}} ASCII bytes matching {{TITLE_PATTERN}}. The creator is you, or somebody you commissioned. Moderating that is a proofreading task.

:::note
The step is a Bitcoin transaction, and a determined contributor can attach other outputs to it, including an unrelated `OP_RETURN` carrying text. ChainBloom ignores anything that is not its own [[marker]], so it never appears in the world. A general-purpose block explorer may still show it. This is worth knowing before you promise a sponsor that nothing unexpected can appear next to their name.
:::

## Moderation before — who is invited

The invitation is the strongest control you have, and it is a technical one rather than a policy one.

When a world is created, it funds one root [[carrier]] output per path, each holding {{CARRIER_VALUE_SATS}} satoshis and locked to a Taproot script chosen by the creator. Whoever controls that script takes the next step on that path. Nobody else can. There is no open door to close later, because the door was never open.

So the practical shapes are:

- **Host-held.** The host controls every path and signs on behalf of contributors, who choose what the step should be. The record shows your address; attribution lives in your own documentation. This is the right default for public programmes with walk-up audiences.
- **Invited.** Root carriers go to named participants you selected. This is a commission, and it behaves like one.
- **Open.** You publish the keys or hand carriers to anyone who asks. Do this only if you would be content with any outcome, because you cannot take it back.

:::warning
Handing a path to someone is not lending. The successor carrier goes wherever that person's transaction sends it, so once they have taken a step, the path continues under their control, not yours. If you need a path back, do not give it away — sign for the contributor instead.
:::

## Moderation around — the prompt and the gallery

Two more controls sit either side of the record.

**The prompt.** What you ask for shapes what you get more than any rule you enforce afterwards. "Add a mark for a person you miss" and "add whatever you like" produce different worlds from the same protocol. Say what a glyph means in this world, say what a palette means, and give an example. Narrow prompts are not a restriction on expression; they are the reason the finished thing holds together.

**The gallery.** Rendering is deliberately outside the rules — see [`src/render.ts`](repo:src/render.ts). Two galleries can draw the same world completely differently and both are correct. That means your interpretation is a genuine editorial position: you decide what is emphasised, what is faint, what is annotated and what is captioned. Curating the presentation is legitimate and expected.

## What a host can hide, and what hiding means

You can omit an event from your own view. Your indexer can be configured not to return it; your gallery can decline to draw it; your wall text can ignore it.

Be precise with yourself about what that achieves. It removes the event from **your** presentation. It does not remove the event. Anyone replaying the same blocks with the same rules reconstructs the same state, including the thing you hid, and the ordering is deterministic — worlds and paths sorted by id, events sorted by height and then by position within the block. That determinism is the point of the design; it is also what stops you from quietly editing history.

So describe it honestly. "We chose not to show this" is a defensible curatorial statement. "This has been removed" is false, and somebody with an indexer will eventually say so in public.

One related case is worth naming because it looks like moderation and is not. If a confirmed transaction spends a live carrier without being a valid ChainBloom event, every path it spent becomes abandoned with the reason `INVALID_CONFIRMED_SPEND`, and the spend is recorded rather than ignored. Nothing is invented to replace the lost path. That is usually an accident with a wallet that did not know what the output was — not a deletion, and not something you can undo.

## Privacy — what a contribution reveals

Tell participants these three things before they take part, in words this plain.

**An address is a pseudonym, and pseudonyms link.** Each step spends the previous carrier and creates the next one, so the whole path is a visible chain that anyone can follow end to end. If the same wallet also pays the fees, the coins used for the fees are linked to the same person. If that wallet is ever connected to a name — an exchange withdrawal, a public donation address, a screenshot — every step it ever took is connected to that name at once, retroactively.

**Block times say when someone acted.** Every event carries the [[block height]] it confirmed in, which narrows the moment to a single block — and about {{MIN_DURATION_BLOCKS}} blocks arrive in a day. A weekly contribution always arriving on Tuesday evenings is a schedule. Somebody's absence for three weeks is also visible. Nobody thinks about this at the time.

**A title is public forever.** The world's title cannot be edited, and it is the only text on the record. A name, a school, a street or a case reference put there stays there.

:::safety
Controlling a wallet does not prove identity, authorship, copyright or legal ownership. Do not let anybody — a participant, a sponsor, a journalist, or your own marketing copy — describe a ChainBloom record as proof that a named person made something. The record proves that a key signed a transaction, and nothing beyond that.
:::

## Concrete guidance for hosts

- Use a wallet dedicated to the programme and nothing else, funded from coins that are not connected to your other activity.
- For walk-up audiences, sign for participants from that wallet. It gives them the experience without giving them a permanent public trail they did not ask for.
- Never put a participant's name, initials, school, employer or case number in the world title.
- Write the consent text before the invitation goes out. It must say the record is permanent, public, unremovable, and outside your control, and that the signing address is linkable across every step it takes.
- For anybody under 18 or otherwise vulnerable, the organisation signs. Full stop.
- Publish the prompt, the path count, the duration and the step limit in advance, so participation is informed rather than improvised.
- State your curatorial policy up front — what you will show, what you will decline to show, and that declining is a display choice, not a deletion.
- Brief the front-of-house team on the one question they will actually be asked, which is "can I take it back", and the one answer, which is no.
- Keep your own attribution records. They are where authorship lives, and they are the ones you can correct.
