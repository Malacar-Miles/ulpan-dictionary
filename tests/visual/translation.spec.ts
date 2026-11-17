import { expect, test } from '@playwright/test';

test('translation practice reveals descriptions and table cells without affecting print', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const preference = page.getByRole('checkbox', { name: 'Перевод', exact: true });
  await expect(preference).toBeChecked();
  await page.getByRole('searchbox').fill('ללמוד');
  await preference.uncheck();
  const card = page.locator('article').first();
  const expand = card.getByRole('button', { name: 'Формы слова ללמוד', exact: true });
  const description = card.getByRole('button', { name: 'Показать перевод на 5 секунд' }).last();
  await expect(description).toHaveCSS('backdrop-filter', 'blur(9px)');
  await expect(description).toHaveCSS('transition-duration', '0.16s, 0.16s, 0.16s');
  await description.focus();
  await page.keyboard.press('Enter');
  await expect(description).toHaveCSS('backdrop-filter', 'blur(0px)');
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  await expect(description).toHaveAttribute('aria-expanded', 'false', { timeout: 6500 });
  await expand.click();
  const cell = card
    .getByRole('table')
    .getByRole('button', { name: 'Показать перевод на 5 секунд' })
    .first();
  await cell.click();
  await expect(cell).toHaveCSS('backdrop-filter', 'blur(0px)');
  await expect(description).toHaveCSS('backdrop-filter', 'blur(9px)');
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  await page.screenshot({ path: testInfo.outputPath('translation-practice.png'), fullPage: true });
  await card.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Предпросмотр печати', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('checkbox', { name: 'Перевод', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Показать перевод на 5 секунд' })).toHaveCount(0);
  await expect(dialog.locator('[data-print-card]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await preference.check();
  await expect(card.getByRole('button', { name: 'Показать перевод на 5 секунд' })).toHaveCount(0);
  await preference.uncheck();
  await page.reload();
  await expect(preference).not.toBeChecked();
  await page.getByRole('button', { name: 'Язык интерфейса' }).click();
  await page.getByRole('button', { name: 'Español', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Traducción', exact: true })).not.toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
