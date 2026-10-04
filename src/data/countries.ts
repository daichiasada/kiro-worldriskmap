import type { Country } from '../domain/types';

/**
 * 国別リスクコンポーネント(各 0..100、高いほど高リスク)。
 *
 * 値は以下の公開定量化指標の相対的な序列を参考にした代表・近似値である:
 *  - Fragile States Index (Fund for Peace)
 *  - Global Peace Index (Institute for Economics & Peace)
 *  - Geopolitical Risk Index (Caldara & Iacoviello, FRB)
 *  - Worldwide Governance Indicators: Political Stability (World Bank)
 *
 * 注意: これらは教育・可視化目的の合成サンプル値であり、各指標の公式値そのものではない。
 * 出典・算出方法は README および UI の「出典」注記を参照。
 */
export const COUNTRIES: Country[] = [
  { id: 'ISL', name: 'Iceland', nameJa: 'アイスランド', region: 'Europe', components: { conflict: 4, governance: 8, economic: 12, external: 6, social: 10 } },
  { id: 'NOR', name: 'Norway', nameJa: 'ノルウェー', region: 'Europe', components: { conflict: 5, governance: 7, economic: 10, external: 10, social: 9 } },
  { id: 'CHE', name: 'Switzerland', nameJa: 'スイス', region: 'Europe', components: { conflict: 6, governance: 8, economic: 11, external: 12, social: 10 } },
  { id: 'JPN', name: 'Japan', nameJa: '日本', region: 'Asia', components: { conflict: 10, governance: 15, economic: 22, external: 30, social: 18 } },
  { id: 'DNK', name: 'Denmark', nameJa: 'デンマーク', region: 'Europe', components: { conflict: 6, governance: 7, economic: 12, external: 11, social: 9 } },
  { id: 'FIN', name: 'Finland', nameJa: 'フィンランド', region: 'Europe', components: { conflict: 8, governance: 8, economic: 13, external: 24, social: 10 } },
  { id: 'CAN', name: 'Canada', nameJa: 'カナダ', region: 'Americas', components: { conflict: 10, governance: 14, economic: 18, external: 16, social: 16 } },
  { id: 'DEU', name: 'Germany', nameJa: 'ドイツ', region: 'Europe', components: { conflict: 12, governance: 16, economic: 22, external: 26, social: 18 } },
  { id: 'AUS', name: 'Australia', nameJa: 'オーストラリア', region: 'Oceania', components: { conflict: 10, governance: 15, economic: 18, external: 20, social: 16 } },
  { id: 'GBR', name: 'United Kingdom', nameJa: 'イギリス', region: 'Europe', components: { conflict: 16, governance: 20, economic: 26, external: 32, social: 24 } },
  { id: 'FRA', name: 'France', nameJa: 'フランス', region: 'Europe', components: { conflict: 20, governance: 22, economic: 28, external: 34, social: 28 } },
  { id: 'KOR', name: 'South Korea', nameJa: '韓国', region: 'Asia', components: { conflict: 24, governance: 24, economic: 26, external: 46, social: 26 } },
  { id: 'USA', name: 'United States', nameJa: 'アメリカ合衆国', region: 'Americas', components: { conflict: 26, governance: 30, economic: 28, external: 44, social: 36 } },
  { id: 'ITA', name: 'Italy', nameJa: 'イタリア', region: 'Europe', components: { conflict: 18, governance: 30, economic: 36, external: 28, social: 28 } },
  { id: 'ESP', name: 'Spain', nameJa: 'スペイン', region: 'Europe', components: { conflict: 16, governance: 26, economic: 34, external: 24, social: 26 } },
  { id: 'POL', name: 'Poland', nameJa: 'ポーランド', region: 'Europe', components: { conflict: 22, governance: 32, economic: 30, external: 48, social: 28 } },
  { id: 'BRA', name: 'Brazil', nameJa: 'ブラジル', region: 'Americas', components: { conflict: 42, governance: 46, economic: 44, external: 30, social: 48 } },
  { id: 'ZAF', name: 'South Africa', nameJa: '南アフリカ', region: 'Africa', components: { conflict: 46, governance: 50, economic: 54, external: 34, social: 56 } },
  { id: 'IND', name: 'India', nameJa: 'インド', region: 'Asia', components: { conflict: 44, governance: 44, economic: 48, external: 52, social: 50 } },
  { id: 'MEX', name: 'Mexico', nameJa: 'メキシコ', region: 'Americas', components: { conflict: 54, governance: 50, economic: 46, external: 34, social: 48 } },
  { id: 'IDN', name: 'Indonesia', nameJa: 'インドネシア', region: 'Asia', components: { conflict: 40, governance: 46, economic: 44, external: 36, social: 46 } },
  { id: 'TUR', name: 'Turkey', nameJa: 'トルコ', region: 'Asia', components: { conflict: 48, governance: 56, economic: 52, external: 62, social: 50 } },
  { id: 'CHN', name: 'China', nameJa: '中国', region: 'Asia', components: { conflict: 34, governance: 58, economic: 36, external: 66, social: 44 } },
  { id: 'SAU', name: 'Saudi Arabia', nameJa: 'サウジアラビア', region: 'Middle East', components: { conflict: 46, governance: 58, economic: 40, external: 64, social: 50 } },
  { id: 'EGY', name: 'Egypt', nameJa: 'エジプト', region: 'Africa', components: { conflict: 52, governance: 60, economic: 60, external: 54, social: 56 } },
  { id: 'IRN', name: 'Iran', nameJa: 'イラン', region: 'Middle East', components: { conflict: 60, governance: 68, economic: 66, external: 82, social: 58 } },
  { id: 'NGA', name: 'Nigeria', nameJa: 'ナイジェリア', region: 'Africa', components: { conflict: 72, governance: 70, economic: 68, external: 48, social: 72 } },
  { id: 'PAK', name: 'Pakistan', nameJa: 'パキスタン', region: 'Asia', components: { conflict: 74, governance: 68, economic: 70, external: 70, social: 70 } },
  { id: 'RUS', name: 'Russia', nameJa: 'ロシア', region: 'Europe', components: { conflict: 70, governance: 66, economic: 56, external: 92, social: 54 } },
  { id: 'VEN', name: 'Venezuela', nameJa: 'ベネズエラ', region: 'Americas', components: { conflict: 66, governance: 80, economic: 86, external: 50, social: 72 } },
  { id: 'ETH', name: 'Ethiopia', nameJa: 'エチオピア', region: 'Africa', components: { conflict: 80, governance: 74, economic: 72, external: 52, social: 76 } },
  { id: 'MMR', name: 'Myanmar', nameJa: 'ミャンマー', region: 'Asia', components: { conflict: 84, governance: 82, economic: 72, external: 56, social: 76 } },
  { id: 'UKR', name: 'Ukraine', nameJa: 'ウクライナ', region: 'Europe', components: { conflict: 88, governance: 54, economic: 70, external: 90, social: 60 } },
  { id: 'IRQ', name: 'Iraq', nameJa: 'イラク', region: 'Middle East', components: { conflict: 78, governance: 76, economic: 68, external: 72, social: 72 } },
  { id: 'COD', name: 'DR Congo', nameJa: 'コンゴ民主共和国', region: 'Africa', components: { conflict: 86, governance: 82, economic: 80, external: 56, social: 84 } },
  { id: 'AFG', name: 'Afghanistan', nameJa: 'アフガニスタン', region: 'Asia', components: { conflict: 92, governance: 90, economic: 88, external: 74, social: 90 } },
  { id: 'SSD', name: 'South Sudan', nameJa: '南スーダン', region: 'Africa', components: { conflict: 94, governance: 92, economic: 90, external: 62, social: 92 } },
  { id: 'SOM', name: 'Somalia', nameJa: 'ソマリア', region: 'Africa', components: { conflict: 95, governance: 94, economic: 88, external: 66, social: 92 } },
  { id: 'SYR', name: 'Syria', nameJa: 'シリア', region: 'Middle East', components: { conflict: 96, governance: 90, economic: 86, external: 84, social: 90 } },
  { id: 'YEM', name: 'Yemen', nameJa: 'イエメン', region: 'Middle East', components: { conflict: 97, governance: 92, economic: 94, external: 80, social: 93 } },
];
