---
title: Bookmarks, profiles, watchlists and notifications
nav: Follow and return
description: None of these features exist yet, so here is the four-line note that lets you find your way back to any world or path with no software at all, plus what the tools must do when they arrive.
socialTitle: How to keep your place in a world today
socialDescription: Four things to write down now, plus what following tools should and must never do once they are built.
updated: 2026-07-31
order: 8
keywords: [bookmark, profile, watchlist, notification, follow, return, save]
related: [participate/return-to-a-path, participate/explore-timelines, help/status]
cta:
  title: Ready to pick the path back up?
  body: With your outpoint written down, returning to a path is a short, ordinary process.
  label: Read return to a path
  href: /docs/participate/return-to-a-path
---

:::lead
There is no follow button, no profile page, and no notification to switch on. There is something better and smaller: four lines of text that will still find your world in ten years, on any tool, with no account anywhere.
:::

:::note
Bookmarks, profiles, watchlists and notifications are not built. Nothing on this page describes software you can use today, and the second half is a design brief, not a feature list. [What is running](/docs/help/status) is the honest current state.
:::

## What you can keep today

Everything you need to return is public, permanent, and small enough to write on a card.

### The world id

A [[world]] is identified by the transaction id of the `CREATE` that opened it. That [[txid]] is the world's name forever. It never changes, it is not owned by any website, and any tool that reads Bitcoin can find it.

Copy it whole. Do not shorten it. Two worlds could share the first six characters, and you will not enjoy discovering that later.

### Your outpoint

If you hold a path, write down the [[outpoint]] of its current output: the `txid:vout` pair created by your most recent step. The output index is part of it. A transaction id alone is not enough to identify one output.

Update this line every time a step of yours confirms. That is the only maintenance any of this needs.

### A link that still works

Paste the transaction id into any Bitcoin block [[explorer]] and bookmark the result. A general explorer will show you the transaction, the outputs, the block it landed in, and whether your output is still unspent, which happens to be the single most useful fact about a live path.

It will not tell you what the action meant. No explorer decodes ChainBloom markers yet, and none show worlds, paths, or timelines. Treat the link as proof of existence and state, not as a reading of the story.

### The block the world ends at

A world's ending is fixed at creation: the height it was created at, plus its duration in blocks. That figure is the end height, and it is exclusive: at that [[block height]] the world expires and every path still live expires with it.

Write the number down. It is the deadline for anything you intend to do, including completing your own path deliberately rather than letting it expire.

## A card worth four lines

Keep this wherever you keep things you will still have next year. A text file, a notes app, the back of the invitation: it does not matter, as long as it is not only in a browser tab.

:::figure caption="One path, recorded in four lines. Update line 3 after each confirmed step."
```text
World title:  Harbour Season
World id:     <txid of the CREATE transaction>
My path:      <worldId>:2   →  outpoint <txid>:1
World ends:   block 921,600   (exclusive)
```
:::

:::simulation
The title, path number and block height above are made up to show the shape of the note. Fill in the real values from your own transaction.
:::

:::tip
Add one more line if you like: the date and block height of your last step. It turns a bare record into something you can read later as a small diary of a world.
:::

## What following tools should be

When bookmarks, profiles, watchlists and notifications are built, here is the standard they should be held to. If you are building them, this is the brief.

### Bookmarks

A bookmark should save the world id, the path id, and the outpoint together, and it should survive being exported. If a bookmark only works inside one website's account, it is worse than the four lines above, because the four lines outlive the website.

### Profiles

A profile should be a place to give **context**: who is holding this path, why they joined this world, what they were trying to do. Context makes a history easier to read, and a world with no human explanation is harder to care about.

A profile is not evidence. Whoever holds a path can take it forward; that is all holding proves. It does not establish that a person is who they say they are, that they made what the world contains, or that they hold any claim over it.

### Watchlists

A watchlist should answer questions a person actually has: has this world's history moved since I last looked, is this path still live, how many blocks are left before it expires. Sorted by what changed, not by what is loudest.

### Notifications

A notification should tell you that something **confirmed**, and it should say which block. The useful ones are narrow: a step you were waiting on landed, a path you follow reached its last permitted step, a world you joined is approaching its end height.

## What they must never do

Three rules, and they are not negotiable.

**Never present a preview as confirmed.** An unconfirmed transaction can be replaced, dropped, or overtaken by a version of itself paying a higher fee. A notification that says "a new moment appeared" about something still in the mempool is teaching people to trust the wrong thing. Unconfirmed and confirmed must look different at a glance, and the difference must survive being screenshotted.

**Never let a profile stand in for proof.** Display names, avatars and biographies are unverified text next to an address. A tool that shows them beside confirmed events must make it obvious which side of that line each piece of information sits on. Nothing about a profile, and nothing about holding a path, establishes identity, authorship, copyright, or ownership.

**Never make following the only way to find something.** A world's history is public and reconstructible from the chain by anyone running the rules. A following tool is a convenience layer on top of that. The moment it becomes the only route in, the property that makes ChainBloom worth using has quietly been given away.

## Where this stands

The public index that would power any of this is not switched on, so there are no live worlds to browse, follow, or be notified about today. [What is running](/docs/help/status) says exactly what exists, what does not, and what changes when the index comes up.

Meanwhile, [exploring timelines](/docs/participate/explore-timelines) covers what there is to look at inside a world once you can see one.
