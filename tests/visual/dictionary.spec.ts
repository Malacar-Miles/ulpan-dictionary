import { expect, test } from '@playwright/test';

test('dictionary appearance and display states', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('initial.png');
  await page.getByRole('button', { name: /Все темы|По темам/ }).click();
  await expect(page).toHaveScreenshot('topics.png');
  await page.getByRole('button', { name: 'Глаголы и состояния', exact: true }).click();
  await page.getByRole('searchbox').fill('ללמוד');
  await page.getByRole('button', { name: 'Формы слова ללמוד', exact: true }).click();
  await expect(page.getByRole('table').first()).toBeVisible();
  await expect(page).toHaveScreenshot('forms.png');
  await page.getByRole('checkbox', { name: 'Пропись' }).check();
  await page.getByRole('checkbox', { name: 'Никуд' }).uncheck();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('handwriting.png');
  await page.getByRole('button', { name: 'Язык интерфейса' }).click();
  await expect(page).toHaveScreenshot('languages.png');
  await page.getByRole('button', { name: 'Español' }).click();
  await expect(page).toHaveScreenshot('spanish.png');
  await page.getByRole('searchbox').fill('zzzznotaword');
  await expect(page.getByText('No se encontraron resultados')).toBeVisible();
  await expect(page).toHaveScreenshot('empty.png');
});

test('card motion and selection survive expansion and searching', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const search = page.getByRole('searchbox');
  await search.fill('ללמוד');
  const toggle = page.getByRole('button', { name: 'Формы слова ללמוד', exact: true });
  const card = page.locator('article').filter({ has: toggle });
  const panel = card.locator('div[aria-hidden="false"]');
  await expect(card).toHaveCSS('user-select', 'text');
  await expect(search).toHaveCSS('user-select', 'text');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveCSS('transition-duration', '0.252s, 0s');
  await expect(card.getByRole('table')).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveCSS('transition-duration', '0.168s, 0s');
  await expect(card.getByRole('table')).toBeHidden();
  await search.fill('לומדת');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveCSS('transition-duration', '0s, 0s');
  await expect(card.getByRole('table')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await toggle.click();
  await expect(panel).toHaveCSS('transition-duration', '0s');
});

test('sticky controls preserve scrolling and touch search focus', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('article').first()).toBeVisible();
  const search = page.getByRole('searchbox');
  await page.evaluate((touch) => {
    const scroller = document.querySelector('[data-dictionary-scroll]')!;
    (touch ? scroller : window).scrollTo(0, 1800);
  }, isMobile);
  await expect.poll(() => search.evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(20);
  await search.fill('תודה');
  await expect(page.locator('article').first()).toBeVisible();
  await search.focus();
  // Dispatch the cancelable touch pointer event that must preserve keyboard focus.
  const canceled = await page.getByRole('checkbox', { name: 'Никуд' }).evaluate((input) => {
    const label = input.closest('label')!;
    return !label.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerType: 'touch',
      }),
    );
  });
  expect(canceled).toBe(true);
  await expect(search).toBeFocused();
  await page.getByRole('button', { name: /Все темы|По темам/ }).click();
  if (isMobile) {
    await expect(page.locator('[data-dictionary-scroll] > div').first()).toHaveCSS(
      'max-height',
      '100%',
    );
  }
  await expect(
    page.getByRole('button', { name: 'Глаголы и состояния', exact: true }),
  ).toBeVisible();
});
