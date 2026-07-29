# Reference architecture

```text
Bitcoin Core / trusted block source
              |
       raw block + prevouts
              v
      transaction parser
              v
 marker codec + state-aware validator
              v
 atomic confirmed state engine ----> non-consensus renderer / API
              ^
              |
     provisional mempool overlay

wallet coin selection -> canonical PSBT builder -> signer -> full validation -> broadcast
```

The codec owns canonical bytes and has no chain state. The parser owns Bitcoin
serialization and normalizes txids. The validator combines those results with a
read-only state/prevout view. The state engine is the only component that
mutates derived confirmed state and does so one complete block at a time.

Builders are intentionally outside the validator: they make safe transaction
shapes but are not evidence that a signed transaction is valid. Rendering is
downstream from state and excluded from consensus. This separation lets another
implementation share vectors and snapshots without sharing UI or storage.
