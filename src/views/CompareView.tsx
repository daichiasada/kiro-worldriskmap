import { useMemo, useState } from 'react';
import type { RelationType, ScoredCountry } from '../domain/types';
import { bilateralRisk, classifyBand } from '../domain/risk';
import { getRelation } from '../data/relations';
import { RELATION_FACTORS } from '../domain/constants';
import { BandPill } from '../components/BandPill';
import { ComponentBars } from '../components/ComponentBars';
import { useI18n } from '../i18n/I18nContext';
import { riskColor } from '../components/colorScale';

/** プルダウンの選択肢: 'auto' は2国から自動判定、それ以外は手動上書き */
type RelationChoice = 'auto' | RelationType;

interface Props {
  countries: ScoredCountry[];
}

function CountryColumn({ c }: { c: ScoredCountry }) {
  const { lang, countryName } = useI18n();
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>
        {countryName(c)} <span className="muted">/ {lang === 'ja' ? c.name : c.nameJa}</span>
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
  const { t, lang, countryName } = useI18n();
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

  const options = [...countries].sort((x, y) =>
    countryName(x).localeCompare(countryName(y), lang),
  );

  // 国の組を変更したら関係設定を自動判定へリセットする
  const changeA = (id: string) => {
    setIdA(id);
    setChoice('auto');
  };
  const changeB = (id: string) => {
    setIdB(id);
    setChoice('auto');
  };

  const overrideLabels: Record<RelationType, string> = {
    ally: t.overrideAlly,
    neutral: t.overrideNeutral,
    rival: t.overrideRival,
  };

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <select value={idA} onChange={(e) => changeA(e.target.value)} aria-label="A">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idB}>
                {countryName(c)}
              </option>
            ))}
          </select>
          <select value={idB} onChange={(e) => changeB(e.target.value)} aria-label="B">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idA}>
                {countryName(c)}
              </option>
            ))}
          </select>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value as RelationChoice)}
            aria-label={t.relationPremise}
          >
            <option value="auto">{t.relationAuto(t.relations[autoRelation])}</option>
            <option value="rival">{overrideLabels.rival}</option>
            <option value="neutral">{overrideLabels.neutral}</option>
            <option value="ally">{overrideLabels.ally}</option>
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="muted">{t.bilateralTitle}</div>
          {sameCountry ? (
            <p className="muted" style={{ margin: '12px 0' }}>
              {t.pickTwo}
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
                {t.appliedRelation} <strong>{t.relations[effectiveRelation]}</strong>
                {' '}(×{RELATION_FACTORS[effectiveRelation]}){' '}
                {choice === 'auto' ? t.autoTag : t.manualTag}
              </p>
            </>
          )}
          <p className="muted" style={{ marginTop: 8 }}>
            {t.compareHint}
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
