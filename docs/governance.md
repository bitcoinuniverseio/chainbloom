# Governance handbook

## Roles

- Contributors propose and review changes.
- Maintainers merge changes, cut releases, and enforce project policy.
- Release managers verify artifacts and provenance; they do not gain protocol
  authority.
- Security responders handle embargoed reports and recuse themselves when
  affected.
- Independent implementers are the practical compatibility check and retain
  full choice over upgrades.

## Protocol proposal lifecycle

A proposal identifies motivation, exact normative change, byte examples,
state-transition examples, backward compatibility, activation strategy,
security/privacy analysis, and rejected alternatives. After triage it receives
an identifier, at least 21 days of public review, and implementation in a topic
branch with valid and invalid vectors. Two independent maintainers must approve;
one must not be the author. Material unresolved objections are summarized in
the decision record.

Clarifications that cannot change any valid/invalid classification may be
merged normally. A change that could alter classification or state uses a new
protocol version. Emergency software releases can fix crashes or disable an
unsafe feature but cannot retroactively redefine version 1.

## Conflicts and commercial influence

Reviewers disclose employment, funding, investments, and integrations that
could reasonably affect judgment. Sponsorship cannot purchase roadmap priority,
merge rights, compatibility claims, or security-report access. Meeting notes
and release decisions are public unless a vulnerability embargo requires delay.
