# Static site version metadata

Run `APP_BUILD_CHANNEL=production npm --prefix site run build:version` during
production packaging, after checkout and before uploading `site/`. Use the
actual build channel for other environments. The generator reads the root
package version and checked-out Git revision, and writes `site/version.json`
(the public endpoint) and `site/public/version-build.js` (the running build). Both
artifacts must come from the same invocation and be published together. The
build requires Git and fails if its channel, version, or revision is invalid.
The timestamp is UTC build time, so rebuilds can be ordered when their versions
match.

Load `public/version-build.js` as a local script before the version UI or update
checker. It defines the non-writable, frozen `globalThis.APP_VERSION` object
with `version`, full `sha`, `builtAt`, and `channel`. Display code can shorten
the SHA. The checker should compare this object with a separately fetched,
trusted production `version.json`; it must not replace the running metadata.
Resolve these assets relative to the deployed site base (GitHub Pages serves
this site under `/chainbloom/`).

The current Pages workflow does not call this command. Integration must add the
production-channel invocation before the Pages artifact is uploaded and mount
the script in the page; neither integration point is owned by this scope.
