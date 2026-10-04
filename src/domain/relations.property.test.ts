import { describe, it } from 'vitest';
import fc from 'fast-check';
import { buildRelations } from './relations';
import { getRelation } from '../data/relations';
import { COUNTRIES } from '../data/countries';

const ids = COUNTRIES.map((c) => c.id);
const idArb = fc.constantFrom(...ids);

describe('性質: 関係性', () => {
  it('getRelation は常に対称', () => {
    fc.assert(
      fc.property(idArb, idArb, (a, b) => getRelation(a, b) === getRelation(b, a)),
    );
  });

  it('buildRelations は起点国を含まず、件数は N-1', () => {
    fc.assert(
      fc.property(idArb, (sourceId) => {
        const source = COUNTRIES.find((c) => c.id === sourceId)!;
        const entries = buildRelations(source, COUNTRIES);
        return (
          entries.length === COUNTRIES.length - 1 &&
          entries.every((e) => e.country.id !== sourceId)
        );
      }),
    );
  });

  it('buildRelations の bilateral は常に 0..100、relation は3種のいずれか', () => {
    fc.assert(
      fc.property(idArb, (sourceId) => {
        const source = COUNTRIES.find((c) => c.id === sourceId)!;
        return buildRelations(source, COUNTRIES).every(
          (e) =>
            e.bilateral >= 0 &&
            e.bilateral <= 100 &&
            ['ally', 'neutral', 'rival'].includes(e.relation),
        );
      }),
    );
  });

  it('並びは関係区分(対立→中立→同盟)で単調非減少', () => {
    const order = { rival: 0, neutral: 1, ally: 2 } as const;
    fc.assert(
      fc.property(idArb, (sourceId) => {
        const source = COUNTRIES.find((c) => c.id === sourceId)!;
        const entries = buildRelations(source, COUNTRIES);
        for (let i = 1; i < entries.length; i++) {
          if (order[entries[i - 1].relation] > order[entries[i].relation]) return false;
        }
        return true;
      }),
    );
  });
});
