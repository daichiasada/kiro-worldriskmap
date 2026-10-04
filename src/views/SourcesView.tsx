import { BAND_THRESHOLDS, RISK_COMPONENT_LABELS, RISK_WEIGHTS } from '../domain/constants';
import type { RiskComponentKey } from '../domain/types';

const KEYS = Object.keys(RISK_WEIGHTS) as RiskComponentKey[];
const { moderate, high, severe } = BAND_THRESHOLDS;
const BAND_RANGE_TEXT = `低 (0–${moderate - 1}) / 中 (${moderate}–${high - 1}) / 高 (${high}–${severe - 1}) / 深刻 (${severe}–100)`;

export function SourcesView() {
  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>出典と算出方法</h2>

      <h3>合成リスクスコアの定義</h3>
      <p className="muted">
        各国について、0〜100 に正規化した 5 つのコンポーネント(高いほど高リスク)の重み付き平均を
        合成リスクスコアとします。重みの合計は 1.00 です。
      </p>
      <ul className="sources">
        {KEYS.map((k) => (
          <li key={k}>
            {RISK_COMPONENT_LABELS[k]}: 重み <strong>{RISK_WEIGHTS[k]}</strong>
          </li>
        ))}
      </ul>
      <p className="muted">リスク区分: {BAND_RANGE_TEXT}</p>

      <h3>参考にした公開定量化指標</h3>
      <ul className="sources">
        <li>
          Fragile States Index — Fund for Peace:{' '}
          <a href="https://fragilestatesindex.org/" target="_blank" rel="noreferrer">
            fragilestatesindex.org
          </a>
        </li>
        <li>Global Peace Index — Institute for Economics &amp; Peace</li>
        <li>
          Geopolitical Risk (GPR) Index — Caldara &amp; Iacoviello (Federal Reserve):{' '}
          <a href="https://www.matteoiacoviello.com/gpr.htm" target="_blank" rel="noreferrer">
            matteoiacoviello.com/gpr.htm
          </a>
        </li>
        <li>Worldwide Governance Indicators (Political Stability) — World Bank</li>
      </ul>

      <div className="disclaimer">
        <strong>免責:</strong>{' '}
        本サイトのスコアは教育・可視化を目的とした合成サンプル値であり、上記各指標の公式値を
        厳密に再現したものではありません。相対的な序列は公開ランキングを参考にしていますが、
        意思決定の根拠として用いないでください。
      </div>
    </section>
  );
}
