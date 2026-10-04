import { describe, it, expect } from 'vitest';
import { buildRelations } from './relations';
import { getRelation, REPRESENTATIVE_COUNTRY_IDS } from '../data/relations';
import { COUNTRIES } from '../data/countries';

describe('getRelation', () => {
  it('無向で対称 (a→b と b→a が一致)', () => {
    expect(getRelation('USA', 'RUS')).toBe(getRelation('RUS', 'USA'));
    expect(getRelation('USA', 'JPN')).toBe(getRelation('JPN', 'USA'));
  });
  it('既知ペアを正しく返す', () => {
    expect(getRelation('USA', 'JPN')).toBe('ally');
    expect(getRelation('USA', 'RUS')).toBe('rival');
    expect(getRelation('CHN', 'RUS')).toBe('ally');
  });
  it('未定義ペアは neutral、自分自身も neutral', () => {
    expect(getRelation('ISL', 'BRA')).toBe('neutral');
    expect(getRelation('JPN', 'JPN')).toBe('neutral');
  });
});

describe('buildRelations', () => {
  const japan = COUNTRIES.find((c) => c.id === 'JPN')!;
  const entries = buildRelations(japan, COUNTRIES);

  it('起点国自身を除外する', () => {
    expect(entries.some((e) => e.country.id === 'JPN')).toBe(false);
    expect(entries.length).toBe(COUNTRIES.length - 1);
  });

  it('日本→アメリカは同盟、日本→ロシアは対立', () => {
    const usa = entries.find((e) => e.country.id === 'USA')!;
    const rus = entries.find((e) => e.country.id === 'RUS')!;
    expect(usa.relation).toBe('ally');
    expect(rus.relation).toBe('rival');
  });

  it('並びは対立→中立→同盟の順(先頭群が rival)', () => {
    const order = { rival: 0, neutral: 1, ally: 2 } as const;
    for (let i = 1; i < entries.length; i++) {
      expect(order[entries[i - 1].relation]).toBeLessThanOrEqual(order[entries[i].relation]);
    }
  });

  it('全エントリの bilateral が 0..100', () => {
    for (const e of entries) {
      expect(e.bilateral).toBeGreaterThanOrEqual(0);
      expect(e.bilateral).toBeLessThanOrEqual(100);
    }
  });
});

describe('代表国リスト', () => {
  it('G7 を含む', () => {
    for (const id of ['USA', 'GBR', 'DEU', 'FRA', 'ITA', 'CAN', 'JPN']) {
      expect(REPRESENTATIVE_COUNTRY_IDS).toContain(id);
    }
  });
  it('全代表国がデータセットに存在する', () => {
    for (const id of REPRESENTATIVE_COUNTRY_IDS) {
      expect(COUNTRIES.some((c) => c.id === id)).toBe(true);
    }
  });
});
