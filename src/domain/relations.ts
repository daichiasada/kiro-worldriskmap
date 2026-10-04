import type { Country, RelationType, ScoredCountry } from './types';
import { bilateralRisk, scoreCountry } from './risk';
import { getRelation } from '../data/relations';

export interface RelationEntry {
  /** 相手国(スコア付き) */
  country: ScoredCountry;
  /** 起点国から見た関係区分 */
  relation: RelationType;
  /** 二国間地政学リスクスコア(0..100、関係係数込み・対称) */
  bilateral: number;
}

/** 関係区分の表示順(対立→中立→同盟) */
const RELATION_ORDER: Record<RelationType, number> = {
  rival: 0,
  neutral: 1,
  ally: 2,
};

/**
 * 起点国から見た、各相手国との関係一覧を生成する(純粋関数)。
 * - 起点国自身は除外する。
 * - 関係区分は data/relations.ts を参照し、未定義は neutral。
 * - 既定の並びは「対立が高い順」:関係区分(対立→中立→同盟)、同区分内は二国間リスク降順。
 */
export function buildRelations(source: Country, all: Country[]): RelationEntry[] {
  return all
    .filter((c) => c.id !== source.id)
    .map((c) => {
      const relation = getRelation(source.id, c.id);
      return {
        country: scoreCountry(c),
        relation,
        bilateral: bilateralRisk(source, c, relation),
      };
    })
    .sort(
      (a, b) =>
        RELATION_ORDER[a.relation] - RELATION_ORDER[b.relation] ||
        b.bilateral - a.bilateral ||
        a.country.name.localeCompare(b.country.name),
    );
}
