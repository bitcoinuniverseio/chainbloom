---
title: Creating a world from start to finish
nav: Create a world
description: Every decision that goes into opening a world, in the order you have to make them, including the four settings that can never be changed once the transaction confirms.
socialTitle: Creating a ChainBloom world
socialDescription: From the idea to the invitation to the signed transaction, with the settings that are fixed forever marked clearly.
updated: 2026-07-31
order: 1
keywords: [create a world, world settings, paths, duration, max steps, title, invitation]
related: [participate/fees-and-confirmation, learn/the-five-actions, programs/moderation-and-privacy]
cta:
  title: Know what you will pay before you decide
  body: What a creation costs, what each path output holds while it is alive, and how long a first confirmation really takes.
  label: Fees and confirmation
  href: /docs/participate/fees-and-confirmation
---

:::lead
Creating a [[world]] is the one moment where you decide the shape of something other people will live inside for weeks. This page walks the whole way through it, and marks clearly the four choices that no one, including you, can edit afterwards.
:::

## Start with the idea, not the settings

A world is an invitation with edges. Before you touch a number, write down three sentences:

1. What this world is for. "A record of one planting bed across the spring."
2. What one contribution should be. "One thing you noticed on the day you looked."
3. What the ending means. "We close on the day of the first harvest."

If you cannot write those three sentences, the settings will not save you. A world with eight paths and a year of runway and no idea what a contribution is will sit empty. A world with two paths, a month, and a clear invitation will fill.

Read [The five actions](/docs/learn/the-five-actions) before you choose. The vocabulary is small on purpose: a contribution is a bloom, an answer to an earlier moment is an echo, and two paths can share a moment without merging. What people can do shapes what you should ask for.

:::tip
Write the invitation before the transaction, and write it somewhere your participants can read it: a page, a poster, a pinned message. The chain records the moves. It does not record what you meant by them.
:::

## The four settings that are fixed forever

These are written into the creation transaction. Once it confirms, they are what the world is. There is no edit, no admin override, and no migration.

| Setting | Allowed range | What it decides |
| --- | --- | --- |
| Paths | {{MIN_LANES}} to {{MAX_LANES}} | How many separate threads the world has |
| Duration | {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks | How long the world stays open |
| Steps per path | {{MIN_MAX_STEPS}} to {{MAX_MAX_STEPS}} | How far any single thread can go |
| Title | up to {{MAX_TITLE_BYTES}} characters | The name carried in the transaction itself |

### Paths

One [[path]] per contributor is the simplest arrangement, and it is what most first worlds should do. More paths is not more life. It is more empty threads if nobody holds them. Decide who holds each path before you create the world, because handing a path to a stranger later is harder than it sounds.

### Duration

Duration is counted in blocks, not days, because blocks are the only clock everyone shares. The range is {{MIN_DURATION_BLOCKS}} to {{MAX_DURATION_BLOCKS}} blocks, roughly {{MIN_DURATION_DAYS}} to {{MAX_DURATION_DAYS}} days. Blocks arrive at an average of one every ten minutes, but the average is not a promise. A quiet stretch can run long and a busy one short.

The world's last usable [[block height]] is the height it was created at plus the duration. At that height the world becomes `EXPIRED`, and every path still alive becomes `EXPIRED` with the reason `WORLD_DURATION_ELAPSED`. Nothing announces it. It simply stops being possible to add anything.

Pick a duration with slack. If your event is four weeks long, do not choose four weeks of blocks.

### Steps per path

Between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}. Each step is a signed transaction with a fee, so the limit is also a budget. A path with a limit of 20 steps and a monthly rhythm is a very different object from one with 400.

When a path reaches its limit, further steps are refused with `MAX_STEPS_REACHED`. Ending the path is still allowed at that point, which means a path can always be closed properly even when it is full.

### Title

At most {{MAX_TITLE_BYTES}} characters. Allowed characters are letters, digits, space, and the four marks `.` `_` `:` `-`. Anything else is rejected with `INVALID_TITLE`; too long is rejected with `INVALID_TITLE_LENGTH`.

:::figure caption="The exact pattern the code enforces, from src/codec.ts"
`{{TITLE_PATTERN}}`
:::

No accents, no emoji, no punctuation beyond those four marks. The title is a handle, not a headline. Keep the poetry for the invitation.

:::warning
Nothing in this table can be changed later. If you want nine paths and you created eight, you create a second world. If you set the duration too short, the world expires on schedule and the history stands as it is. Read the review screen against this table before you sign.
:::

## What the transaction actually contains

A creation transaction has a shape you can check by eye, and you should.

Output 0 is the [[marker]]: an `OP_RETURN` output with value 0 carrying at most {{MAX_MARKER_BYTES}} bytes. It holds the magic `{{PROTOCOL_MAGIC}}`, the version, the network, the operation, and the settings you chose.

Then one output per path, each holding exactly {{CARRIER_VALUE_SATS}} satoshis and each a Taproot output. These are the [[carrier|carriers]]: the small outputs that hold each path in place. A world with three paths has outputs 1, 2, and 3.

Every input is a plain funding input. All of them must be native SegWit, or the transaction is refused with `NON_NATIVE_SEGWIT_FEE_INPUT`. A creation transaction may not spend a live path output from some other world; that is `CREATE_SPENDS_CARRIER`.

:::demo name=marker-explorer
The marker begins with an {{HEADER_BYTES}}-byte header: the four magic bytes `{{PROTOCOL_MAGIC_HEX}}` spelling `{{PROTOCOL_MAGIC}}`, then one byte of protocol version, one byte naming the network, one byte for the operation, and one byte giving the payload length.

For a creation the payload is 23 bytes plus the length of the title. It carries the ruleset number, the number of paths, the duration in blocks, the step limit, a {{SEED_BYTES}}-byte seed, and the title text. The seed is what makes two galleries draw the same world with the same arrangement rather than a random one.

Change any single byte and the marker stops being a ChainBloom marker. A wrong magic gives `INVALID_MAGIC`; an unknown network byte gives `RESERVED_NETWORK`; one extra byte on the end gives `NON_MINIMAL_OP_RETURN`.
:::

Once it confirms, the transaction's [[txid]] becomes the world's id. Path ids are that id, a colon, and a number counting from zero, so the first path of world `a1b2…` is `a1b2…:0`.

## Doing it

The build, review, sign and broadcast flow runs today inside the ChainBloom workspace in [InScribe](app), on its Act surface. No wallet has ChainBloom support of its own yet, so a wallet will show you a Bitcoin transaction and not a world. That is why the checks below are on you.

:::checklist id=create-world
- Write the invitation: what the world is for, what one contribution is, what the ending means.
- Decide how many paths, between {{MIN_LANES}} and {{MAX_LANES}}, and name the person who will hold each one.
- Decide the duration in blocks, between {{MIN_DURATION_BLOCKS}} and {{MAX_DURATION_BLOCKS}}, and write down the calendar date it lands on.
- Decide the step limit per path, between {{MIN_MAX_STEPS}} and {{MAX_MAX_STEPS}}.
- Choose a title of at most {{MAX_TITLE_BYTES}} characters using only letters, digits, space, and `.` `_` `:` `-`.
- Check the network you selected matches the wallet you are about to sign with.
- Fund the transaction with native SegWit inputs, none of which is a live path output.
- On the review screen, check output 0 is the marker with value 0.
- On the review screen, count the {{CARRIER_VALUE_SATS}}-satoshi outputs and check there is exactly one per path.
- Check the miner fee and the change address.
- Sign, broadcast, and note the txid immediately.
- Wait for the first confirmation before telling anyone the world exists.
- Send one path output to each participant, and tell them the world id and their path id.
:::

### Handing out the paths

A path belongs to whoever controls its output. There is no invite list and no permission table. To give someone a path, you send them that {{CARRIER_VALUE_SATS}}-satoshi output to an address they control, exactly as you would send any other Bitcoin output.

Send the paths one at a time and confirm each hand-off before the next. Tell each person their path id in writing. A participant who knows only "you have a path in the garden world" cannot find it.

:::safety
Do not send a path output to an exchange deposit address, a custodial account, or any address whose spending you do not control. Custodians sweep small outputs. A swept path is spent by a transaction that is not a valid ChainBloom step, which marks the path `ABANDONED` with the reason `INVALID_CONFIRMED_SPEND`. The history keeps that fact. Nothing is invented to replace the path.
:::

## After it confirms

Your job changes from designing to hosting. Three things help more than anything else:

Publish the world id and the path ids somewhere durable. People will come back in six weeks and will not remember them.

Say what you expect the rhythm to be. "One bloom a week, roughly" gives people permission to be slow.

Be clear about what belongs in the world. Everything written into a marker is public, permanent, and readable by anyone forever, including by people you did not invite. [Moderation and privacy](/docs/programs/moderation-and-privacy) covers what you can and cannot do about that, and the honest answer is that you decide before, not after.

The last thing worth saying: a world you created is not yours. You chose its edges. What happens inside them belongs to the people holding the paths, and the ending belongs to whoever closes the last one.
