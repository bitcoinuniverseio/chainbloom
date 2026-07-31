---
title: Governance and contributing
nav: Governance
description: How the protocol is looked after, what stewardship is there to protect, how a change gets proposed, and the private path for reporting a security problem.
socialTitle: ChainBloom governance and contributing
socialDescription: What the project protects, how changes are discussed in the open, and how to report a security issue privately and safely.
updated: 2026-07-31
order: 15
keywords: [governance, contributing, stewardship, security reporting, code of conduct, compatibility]
related: [reference/changelog, programs/moderation-and-privacy, help/status]
cta:
  title: What exists, and what does not
  body: The current version, what the package contains today, and the parts that are not finished.
  label: Read the version page
  href: /docs/reference/changelog
---

:::lead
A shared history is only trustworthy if the rules that read it stay predictable. ChainBloom is stewarded in the open, in public conversations anyone can join, and this page says what that stewardship is for, how a change is made, and how to raise a problem safely. Most of it is short on purpose.
:::

## What stewardship protects

Governance here is not about controlling a project. It is about protecting four properties that make the work usable, in roughly this order of stubbornness.

**A stable meaning for confirmed actions.** A [[world]] that has already ended must read the same way in ten years as it does today. Every world records the [[ruleset]] it was created under -- ruleset {{RULESET_VERSION}} at present -- and a rule change gets a new ruleset number rather than a new interpretation of an old one. This is the property that is defended hardest, because it is the only one that cannot be repaired after the fact.

**The separation between history and presentation.** What happened is settled by Bitcoin. How it looks is not. Rendering is explicitly non-consensus, so galleries, applications, and exhibitions may interpret a world however they like without any of them becoming the authority on it. A proposal that quietly moves a presentation decision into the protocol is a proposal to make one interpretation official, and is treated as such.

**Honest communication about fees and confirmation.** People are signing real Bitcoin transactions with real fees, and a confirmed action cannot be undone. Interfaces built on this protocol should say so plainly, show the fee before signing, and never present an unconfirmed step as settled. Softening that language is not a design improvement.

**Compatibility across applications.** A world made in one application must be readable in every other. That is why unknown opcodes are refused rather than skipped, why markers have exactly one legal encoding, and why the [test vectors](/docs/reference/test-vectors) are published: they make "compatible" a testable claim rather than an intention.

## How a change is proposed

Changes are discussed in public, in the repository, before they are written.

A proposal is expected to answer three questions in plain language, and answering them well matters more than writing them formally:

1. **Who does this help, and how?** Named people doing a named thing. "Creators running a class over a term" is a reason; "flexibility" is not.
2. **What is the safety impact?** Anything touching keys, fees, irreversibility, or privacy needs this section, even if the answer is none.
3. **What does it do to worlds that already exist?** This is the question that decides how a change is handled.

Discussion is open to anyone: creators, participants, artists, accessibility advocates, archivists, educators, and the people running services. Familiarity with Bitcoin is not a requirement for having an opinion worth hearing, and a proposal that only its author can understand has not finished being written.

A change that alters nothing about how existing worlds read -- better documentation, a clearer error message, a faster indexer, a new gallery -- is easy, and moves at the speed of review.

## Changes that would touch a finished world

These are treated differently, and slowly.

If a proposal would change how an already-confirmed event reads, the answer is a new ruleset, not a redefinition. Old worlds keep being read under the ruleset they recorded; new worlds may opt into new rules by recording the new number. Nothing that is already settled gets a second meaning.

That constraint rules out a whole family of otherwise reasonable ideas: reusing a reserved opcode, widening a field, reinterpreting a payload byte, or making a reader lenient about something it currently refuses. It is a real cost, accepted on purpose. A change with wide reach also deserves broad review and clear communication before it touches anyone's experience, which is the slower half of the work.

## Why security issues are handled privately first

Because the first person to learn about a weakness should not be the person best placed to use it.

A public issue describing an unfixed problem is a set of instructions. When keys, funds, or participant privacy could be affected, early publication converts a fixable problem into an incident. So a security report goes through a private channel first, gets assessed, and is fixed before it is described in public.

That is a delay, not a secret. The outcome is shared openly once a safe remedy exists, and public credit is welcome whenever the reporter wants it and publishing no longer creates avoidable risk. The private window exists to protect people, not the project's reputation.

## How to report a security issue

Use the repository's **private GitHub Security Advisory** form. Do not open a public issue, and do not post the details in a public discussion.

Include what actually helps:

- what happened, and what you expected instead;
- which ChainBloom experience or component it affects;
- a safe way to reproduce it;
- transaction ids, and non-secret logs.

:::safety
Never put a seed phrase or a private key in a report. They are not evidence and they cannot help. If you think a key has been exposed, stop signing, move remaining funds with a wallet you trust, and get qualified incident help before you write anything up.
:::

Reports get an acknowledgement, an assessment of impact, coordinated work on a remedy, and clear communication about any action people need to take. That last part matters: if participants have to do something, they will be told plainly what and why.

Community conduct concerns -- harassment, impersonation, doxxing, or anyone attempting to obtain keys or seed phrases -- go privately to the maintainers as well, and are handled with care and confidentiality where possible.

## Where the documents live

Four short files in the repository carry the actual commitments, and none of them takes long to read:

| File | What it covers |
| --- | --- |
| [CONTRIBUTING.md](repo:CONTRIBUTING.md) | How to share an idea or report a problem, and what never to include in a public post |
| [CODE_OF_CONDUCT.md](repo:CODE_OF_CONDUCT.md) | The behaviour expected in public spaces, and how concerns are reported |
| [SECURITY.md](repo:SECURITY.md) | The private reporting path and what a useful report contains |
| [GOVERNANCE.md](repo:GOVERNANCE.md) | What stewardship protects and how significant changes are reviewed |

The protocol itself is MIT licensed. You may build on it, fork it, index it, or render it without asking, and nothing in this page is a permission gate on any of that.

## Contributing without writing code

Most of what this medium still needs is not code. Nobody has settled yet what a good world looks like, how long one should stay open, how a [[meeting]] should feel, or what an ending should mean -- and those answers will come from worlds people actually make.

Useful contributions include running a world and writing down honestly what worked, translating documentation, testing pages with a screen reader and reporting what breaks, writing an example other people can copy, and teaching this to a room of beginners and reporting where they got stuck. Say clearly whether a contribution is official project work or independent community expression, and credit creative work you build on.
