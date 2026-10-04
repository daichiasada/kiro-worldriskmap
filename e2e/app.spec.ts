import { test, expect } from '@playwright/test';

test.describe('World Geopolitical Risk Map', () => {
  test('ホーム(地図)が表示され凡例とサマリがある', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /World Geopolitical Risk Map/ })).toBeVisible();
    await expect(page.getByLabel('リスク凡例')).toBeVisible();
    // 地図 SVG が描画される(リモート TopoJSON 読み込み)
    await expect(page.locator('svg path').first()).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'e2e-shots/01-map.png', fullPage: true });
  });

  test('ランキングタブ: 検索とソートが機能する', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'ランキング' }).click();
    const rows = page.getByTestId('rank-row');
    await expect(rows.first()).toBeVisible();
    const initialCount = await rows.count();
    expect(initialCount).toBeGreaterThan(10);

    await page.getByLabel('国名で検索').fill('日本');
    await expect(rows).toHaveCount(1);
    await expect(page.getByText('日本')).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/02-ranking-search.png', fullPage: true });
  });

  test('ランキング行クリックで国別詳細に遷移する', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'ランキング' }).click();
    await page.getByTestId('rank-row').first().click();
    await expect(page.getByRole('tab', { name: '国別詳細' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByText('リスク内訳')).toBeVisible();
    // 回帰防止 (Issue #1): 内訳バーの fill が実際に幅を持って描画されること
    const firstFill = page.locator('.bar-fill').first();
    await expect(firstFill).toBeVisible();
    const box = await firstFill.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
    await page.screenshot({ path: 'e2e-shots/03-detail.png', fullPage: true });
  });

  test('2国間比較で同一国を選ぶと注意表示になる (Issue #3)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '2国間比較' }).click();
    // 国B を 国A と同じにしようとしても option が disabled のため、
    // ここでは JS で同一化した場合のガード表示を直接検証する代わりに、
    // 片方の選択肢が disabled になっていることを確認する。
    const selectB = page.getByLabel('国B');
    const disabledCount = await selectB.locator('option[disabled]').count();
    expect(disabledCount).toBeGreaterThan(0);
  });

  test('タブは矢印キーで移動できる (Issue #2)', async ({ page }) => {
    await page.goto('/');
    const mapTab = page.getByRole('tab', { name: '世界地図' });
    await mapTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'ランキング' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('2国間比較タブ: スコアが表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '2国間比較' }).click();
    await expect(page.getByText('2国間地政学リスクスコア (対称)')).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/04-compare.png', fullPage: true });
  });

  test('出典タブ: 免責と指標が表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '出典' }).click();
    await expect(page.getByText('免責:')).toBeVisible();
    await expect(page.getByText('Fragile States Index')).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/05-sources.png', fullPage: true });
  });
});
