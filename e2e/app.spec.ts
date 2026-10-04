import { test, expect } from '@playwright/test';

// 既定言語は英語 (en)。i18n の aria-label/文言も英語前提。
test.describe('World Geopolitical Risk Map', () => {
  test('home (map) shows legend and summary; default language is English', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /World Geopolitical Risk Map/ })).toBeVisible();
    // 既定は英語タブ
    await expect(page.getByRole('tab', { name: 'World Map' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Ranking' })).toBeVisible();
    await expect(page.getByLabel('Risk legend')).toBeVisible();
    await expect(page.locator('svg path').first()).toBeVisible({ timeout: 15000 });
    // <html lang> が en
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.screenshot({ path: 'e2e-shots/01-map.png', fullPage: true });
  });

  test('language switch to 日本語 translates UI and persists (Issue #13)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('tab', { name: 'World Map' })).toBeVisible();
    // 日本語へ切替
    await page.getByRole('button', { name: '日本語' }).click();
    await expect(page.getByRole('tab', { name: '世界地図' })).toBeVisible();
    await expect(page.getByLabel('リスク凡例')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    // リロードしても日本語が保持される (localStorage)
    await page.reload();
    await expect(page.getByRole('tab', { name: '世界地図' })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    // 英語に戻す
    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('tab', { name: 'World Map' })).toBeVisible();
  });

  test('map relations mode shows overlay, source selector and lines (Issue #9)', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('svg path').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByLabel('Representative source country')).toHaveCount(0);
    await page.getByLabel('Display mode:').selectOption('relations');
    await expect(page.getByLabel('Representative source country')).toBeVisible();
    await expect(page.getByLabel('Relation legend')).toBeVisible();
    await expect(page.locator('.rsm-line').first()).toBeVisible({ timeout: 15000 });
    expect(await page.locator('.rsm-line').count()).toBeGreaterThan(1);
    await page.screenshot({ path: 'e2e-shots/07-map-relations.png', fullPage: true });
    await page.getByLabel('Display mode:').selectOption('risk');
    await expect(page.getByLabel('Representative source country')).toHaveCount(0);
    await expect(page.getByLabel('Risk legend')).toBeVisible();
  });

  test('ranking: search and sort work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Ranking' }).click();
    const rows = page.getByTestId('rank-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(10);
    // 検索は英名でも日本語名でもヒットする
    await page.getByLabel('Search by country name').fill('Japan');
    await expect(rows).toHaveCount(1);
    await page.screenshot({ path: 'e2e-shots/02-ranking-search.png', fullPage: true });
  });

  test('clicking a ranking row opens country detail; bars have width (Issue #1)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Ranking' }).click();
    await page.getByTestId('rank-row').first().click();
    await expect(page.getByRole('tab', { name: 'Country Detail' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByText('Risk breakdown')).toBeVisible();
    const firstFill = page.locator('.bar-fill').first();
    await expect(firstFill).toBeVisible();
    const box = await firstFill.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
    await page.screenshot({ path: 'e2e-shots/03-detail.png', fullPage: true });
  });

  test('compare: same-country option is disabled (Issue #3)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Compare Two' }).click();
    const selectB = page.getByLabel('B', { exact: true });
    expect(await selectB.locator('option[disabled]').count()).toBeGreaterThan(0);
  });

  test('tabs are navigable with arrow keys (Issue #2)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'World Map' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Ranking' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('compare: score and auto-detected relation shown (Issue #8)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Compare Two' }).click();
    await expect(page.getByText(/Bilateral geopolitical risk score/)).toBeVisible();
    const relSelect = page.getByLabel('Relation premise');
    await expect(relSelect).toHaveValue('auto');
    // 既定は米×中 → 自動判定「Rival」
    await expect(relSelect.locator('option[value="auto"]')).toContainText('Rival');
    await expect(page.getByText(/Applied relation:/)).toBeVisible();
    await expect(page.getByText(/\[auto\]/)).toBeVisible();
    await relSelect.selectOption('ally');
    await expect(page.getByText(/\[manual override\]/)).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/04-compare.png', fullPage: true });
  });

  test('compare: changing a country resets relation to auto (Issue #8)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Compare Two' }).click();
    const relSelect = page.getByLabel('Relation premise');
    await relSelect.selectOption('neutral');
    await expect(relSelect).toHaveValue('neutral');
    await page.getByLabel('A', { exact: true }).selectOption('JPN');
    await expect(relSelect).toHaveValue('auto');
  });

  test('relations tab (G7+): list from an origin country (Issue #7)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /Relations/ }).click();
    await page.getByLabel('Representative source country').selectOption('JPN');
    const rows = page.getByTestId('relation-row');
    await expect(rows.first()).toBeVisible();
    // 起点国 (Japan) は一覧に含まれない
    await expect(rows.filter({ hasText: 'Japan' })).toHaveCount(0);
    expect(await rows.count()).toBeGreaterThan(10);
    // 先頭群は rival
    await expect(page.locator('[data-relation]').first()).toHaveAttribute('data-relation', 'rival');
    await page.screenshot({ path: 'e2e-shots/06-relations.png', fullPage: true });
  });

  test('sources tab: disclaimer and indices shown', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Sources' }).click();
    await expect(page.getByText('Disclaimer:')).toBeVisible();
    await expect(page.getByText('Fragile States Index')).toBeVisible();
    await page.screenshot({ path: 'e2e-shots/05-sources.png', fullPage: true });
  });
});
