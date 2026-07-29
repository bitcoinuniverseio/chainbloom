# Release process

Pre-1.0 releases may change SDK APIs, but version 1 protocol bytes and accepted
state cannot change without the governance process. The release manager:

1. updates `CHANGELOG.md` and the package version;
2. runs `npm ci` on Node 22, `npm run ci`, and `npm pack --dry-run`;
3. verifies vectors and regenerates fixtures to stdout for a zero diff;
4. checks dependency licenses and production audit output;
5. obtains maintainer review and signs an annotated `vX.Y.Z` tag;
6. lets the tag workflow publish with npm provenance;
7. verifies tarball contents, package signature/provenance, CLI help, and one
   clean-install vector check;
8. publishes release notes with compatibility and security statements.

Never publish from a dirty tree or by bypassing `prepublishOnly`. A compromised
release is deprecated immediately, credentials and trusted-publisher settings
are rotated, an advisory is issued, and a new version—not a replaced tarball—is
published.
