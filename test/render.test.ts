import { projectBloom, renderWorldSvg } from '../src/render.js';
import { ChainBloomState } from '../src/state.js';
import { NETWORK } from '../src/constants.js';
import { fixtureBlock, loadFixtures } from './fixtures.js';

it('produces deterministic and escaped non-consensus SVG', async () => {
  const fixtures = await loadFixtures();
  const state = new ChainBloomState({ network: NETWORK.REGTEST });
  state.replay(fixtures.map(fixtureBlock));
  const snapshot = state.snapshot();
  const world = { ...snapshot.worlds[0]!, title: '<Garden>' };
  expect(projectBloom(world, snapshot.events)).toEqual(
    projectBloom(world, snapshot.events),
  );
  const svg = renderWorldSvg(world, snapshot.events);
  expect(svg).toContain('&lt;Garden&gt;');
  expect(svg).not.toContain('<Garden>');
  expect(svg.match(/<circle /gu)).toHaveLength(5);
});
