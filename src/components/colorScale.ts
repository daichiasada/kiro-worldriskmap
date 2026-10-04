import { scaleLinear } from 'd3-scale';

/** スコア(0..100)を緑→黄→赤のグラデーション色にマッピングする */
export const riskColorScale = scaleLinear<string>()
  .domain([0, 25, 50, 75, 100])
  .range(['#2e8b57', '#9fb305', '#e3b505', '#e8590c', '#c92a2a'])
  .clamp(true);

export function riskColor(score: number): string {
  return riskColorScale(score);
}
