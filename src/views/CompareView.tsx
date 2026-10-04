import { useMemo, useState } from 'react';
import type { RelationType, ScoredCountry } from '../domain/types';
import { bilateralRisk, classifyBand } from '../domain/risk';
import { getRelation } from '../data/relations';
import { RELATION_FACTORS } from '../domain/constants';
import { BandPill } from '../components/BandPill';
import { ComponentBars } from '../components/ComponentBars';
import { riskColor } from '../components/colorScale';

/** プルダウンの選択肢: 'auto' は2国から自動判定、それ以外は手動上書き */
type RelationChoice = 'auto' | RelationType;

const RELATION_NAMES: Record<RelationType, string> = {
  ally: '同盟',
  neutral: '中立',
  rival: '対立',
};

/** 手動上書き肢のラベル(係数と効果を明記) */
const OVERRIDE_LABELS: Record<RelationType, string> = {
  ally: `同盟 — リスク×${RELATION_FACTORS.ally}(低減)`,
  neutral: `中立 — リスク×${RELATION_FACTORS.neutral}`,
  rival: `対立 — リスク×${RELATION_FACTORS.rival}(増大)`,
};

interface Props {
  countries: ScoredCountry[];
}

function CountryColumn({ c }: { c: ScoredCountry }) {
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>
        {c.nameJa} <span className="muted">/ {c.name}</span>
      </h3>
      <div className="big-score" style={{ color: riskColor(c.score) }}>
        {c.score.toFixed(1)}
      </div>
      <div style={{ margin: '8px 0 14px' }}>
        <BandPill band={c.band} />
      </div>
      <ComponentBars components={c.components} />
    </div>
  );
}

export function CompareView({ countries }: Props) {
  const [idA, setIdA] = useState(countries.find((c) => c.id === 'USA')?.id ?? countries[0].id);
  const [idB, setIdB] = useState(countries.find((c) => c.id === 'CHN')?.id ?? countries[1].id);
  // 既定は 'auto'(2国の関係をデータから自動判定)。ユーザーは任意で手動上書きできる。
  const [choice, setChoice] = useState<RelationChoice>('auto');

  const a = countries.find((c) => c.id === idA)!;
  const b = countries.find((c) => c.id === idB)!;
  const sameCountry = idA === idB;

  // 2国から自動判定される関係区分
  const autoRelation = useMemo(() => getRelation(idA, idB), [idA, idB]);
  // 実際に適用する関係区分(auto のときは自動判定結果)
  const effectiveRelation: RelationType = choice === 'auto' ? autoRelation : choice;
  const bilateral = bilateralRisk(a, b, effectiveRelation);

  const options = [...countries].sort((x, y) => x.nameJa.localeCompare(y.nameJa, 'ja'));

  // 国の組を変更したら関係設定を自動判定へリセットする
  const changeA = (id: string) => {
    setIdA(id);
    setChoice('auto');
  };
  const changeB = (id: string) => {
    setIdB(id);
    setChoice('auto');
  };

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <select value={idA} onChange={(e) => changeA(e.target.value)} aria-label="国A">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idB}>
                {c.nameJa}
              </option>
            ))}
          </select>
          <select value={idB} onChange={(e) => changeB(e.target.value)} aria-label="国B">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idA}>
                {c.nameJa}
              </option>
            ))}
          </select>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value as RelationChoice)}
            aria-label="関係の前提"
            title="2国間リスクの算出に用いる関係係数。既定は2国から自動判定します。"
          >
            <option value="auto">関係: 自動判定({RELATION_NAMES[autoRelation]})</option>
            <option value="rival">{OVERRIDE_LABELS.rival}</option>
            <option value="neutral">{OVERRIDE_LABELS.neutral}</option>
            <option value="ally">{OVERRIDE_LABELS.ally}</option>
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="muted">2国間地政学リスクスコア (対称)</div>
          {sameCountry ? (
            <p className="muted" style={{ margin: '12px 0' }}>
              異なる2国を選択してください。
            </p>
          ) : (
            <>
              <div className="big-score" style={{ color: riskColor(bilateral) }}>
                {bilateral.toFixed(1)}
              </div>
              <div style={{ marginTop: 6 }}>
                <BandPill band={classifyBand(bilateral)} />
              </div>
              <p className="muted" style={{ marginTop: 8 }}>
                適用中の関係:{' '}
                <strong>{RELATION_NAMES[effectiveRelation]}</strong>
                (リスク×{RELATION_FACTORS[effectiveRelation]})
                {choice === 'auto' ? '〔自動判定〕' : '〔手動上書き〕'}
              </p>
            </>
          )}
          <p className="muted" style={{ marginTop: 8 }}>
            両国の「対外関係」「紛争・暴力」の平均に関係係数を乗じて算出します。関係は既定で2国から
            自動判定され、プルダウンで任意に上書きできます。国の順序には依存しません。
          </p>
        </div>
      </div>

      <div className="grid-2">
        <CountryColumn c={a} />
        <CountryColumn c={b} />
      </div>
    </section>
  );
}
