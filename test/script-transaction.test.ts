import {
  classifyNativeSegwit,
  decodeMinimalOpReturn,
  encodeMinimalOpReturn,
  extractOpReturnFirstPush,
  isP2trScript,
  isPotentialChainBloomScript,
  p2trScriptHex,
} from '../src/script.js';
import { parseTransactionHex } from '../src/transaction.js';
import { loadFixtures } from './fixtures.js';

describe('script and raw transaction handling', () => {
  it('encodes one minimal direct push and rejects alternatives', () => {
    const marker = Uint8Array.from([0x43, 0x42, 0x4c, 0x4d]);
    const script = encodeMinimalOpReturn(marker);
    expect(decodeMinimalOpReturn(script)).toEqual(marker);
    expect(() =>
      decodeMinimalOpReturn(Uint8Array.from([0x6a, 0x4c, 0x04, ...marker])),
    ).toThrow();
    expect(extractOpReturnFirstPush('6a4c0443424c4d')).toEqual(marker);
    expect(isPotentialChainBloomScript('6a4c0443424c4d')).toBe(true);
    expect(isPotentialChainBloomScript('0014' + '11'.repeat(20))).toBe(false);
  });

  it('classifies native SegWit and P2TR scripts', () => {
    const taproot = p2trScriptHex(Uint8Array.from({ length: 32 }, () => 7));
    expect(isP2trScript(taproot)).toBe(true);
    expect(classifyNativeSegwit(taproot)).toBe('p2tr');
    expect(classifyNativeSegwit(`0014${'11'.repeat(20)}`)).toBe('p2wpkh');
    expect(classifyNativeSegwit(`0020${'22'.repeat(32)}`)).toBe('p2wsh');
    expect(classifyNativeSegwit('76a914' + '11'.repeat(20) + '88ac')).toBeNull();
  });

  it('parses all golden transactions without changing txids', async () => {
    for (const fixture of await loadFixtures()) {
      const parsed = parseTransactionHex(fixture.hex);
      expect(parsed.txid).toBe(fixture.txid);
      expect(parsed.version).toBe(2);
      expect(parsed.hasWitness).toBe(true);
      expect(parsed.outputs[0]?.value).toBe(0n);
    }
  });
});
