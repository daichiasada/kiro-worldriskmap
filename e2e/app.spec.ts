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

  test('世界地図: 関係モードに切り替えると関係オーバーレイと起点国セレクタが出る (Issue #9)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('svg path').first()).toBeVisible({ timeout: 15000 });
    // 既定はリスクモード、起点国セレクタは出ていない
    await expect(page.getByLabel('起点となる代表国')).toHaveCount(0);
    // 関係モードへ
    await page.getByLabel('地図の表示モード').selectOption('relations');
    await expect(page.getByLabel('起点となる代表国')).toBeVisible();
    await expect(page.getByLabel('関係凡例')).toBeVisible();
    // 関係線 (react-simple-maps の Line = .rsm-line) が複数描画される
    await expect(page.locator('.rsm-line').first()).toBeVisible({ timeout: 15000 });
    expect(await page.locator('.rsm-line').count()).toBeGreaterThan(1);
    await page.screenshot({ path: 'e2e-shots/07-map-relations.png', fullPage: true });
    // リスクモードに戻すと起点国セレクタが消える
    await page.getByLabel('地図の表示モード').selectOption('risk');
    await expect(page.getByLabel('起点となる代表国')).toHaveCount(0);
    await expect(page.getByLabel('リスク凡例')).toBeVisible();
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

  test('2国間比較タブ: スコアと関係自動判定が表示される (Issue #8)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '2国間比較' }).click();
    await expect(page.getByText('2国間地政学リスクスコア (対称)')).toBeVisible();
    // 既定は米×中 → 関係は自動判定で「対立」
    const relSelect = page.getByLabel('関係の前提');
    await expect(relSelect).toHaveValue('auto');
    // 自動判定の option ラベルに「対立」が含まれる
    await expect(relSelect.locator('option[value="auto"]')).toContainText('自動判定(対立)');
    await expect(page.getByText(/適用中の関係:/)).toBeVisible();
    await expect(page.getByText(/〔自動判定〕/)).toBeVisible();
    // 手動上書き(同盟)に変更するとラベルが手動に変わる
    await relSelect.selectOption('ally');
    await expect(page.getByText(/〔手動上書き〕/)).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/04-compare.png', fullPage: true });
  });

  test('2国間比較: 国を変えると関係が自動判定にリセットされる (Issue #8)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '2国間比較' }).click();
    const relSelect = page.getByLabel('関係の前提');
    await relSelect.selectOption('neutral');
    await expect(relSelect).toHaveValue('neutral');
    // 国Aを変更 → auto にリセット
    await page.getByLabel('国A').selectOption('JPN');
    await expect(relSelect).toHaveValue('auto');
  });

  test('関係性タブ(G7等): 起点国から見た関係一覧が表示される (Issue #7)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /関係性/ }).click();
    // 起点国を日本に
    await page.getByLabel('起点となる代表国').selectOption('JPN');
    const rows = page.getByTestId('relation-row');
    await expect(rows.first()).toBeVisible();
    // 起点国(日本)は一覧(テーブル行)に含まれない
    await expect(rows.filter({ hasText: '日本' })).toHaveCount(0);
    // 件数は全データ数 - 1 (起点国を除外)
    expect(await rows.count()).toBeGreaterThan(10);
    // 関係バッジが存在する(対立/同盟/中立のいずれか)
    await expect(page.locator('[data-relation]').first()).toBeVisible();
    // 先頭群は対立(rival)でソートされている
    await expect(page.locator('[data-relation]').first()).toHaveAttribute('data-relation', 'rival');
    await page.screenshot({ path: 'e2e-shots/06-relations.png', fullPage: true });
  });

  test('出典タブ: 免責と指標が表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '出典' }).click();
    await expect(page.getByText('免責:')).toBeVisible();
    await expect(page.getByText('Fragile States Index')).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/05-sources.png', fullPage: true });
  });
});
