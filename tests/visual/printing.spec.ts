import { expect, test } from '@playwright/test';
import type { DictionaryData, DictionaryLocalization } from '../../src/types';

test('card selection has a large target, preserves expansion and survives views and languages', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const search = page.getByRole('searchbox');
  await search.fill('ללמוד');
  const checkbox = page.getByRole('checkbox', { name: 'Выбрать для печати: ללמוד', exact: true });
  const label = checkbox.locator('..');
  const bounds = await label.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('[data-print-selection]')).toBeHidden();
  await label.click({ position: { x: 3, y: 3 } });
  await expect(checkbox).toBeChecked();
  await expect(
    page.getByRole('button', { name: 'Формы слова ללמוד', exact: true }),
  ).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-print-selection]')).toContainText('Выбрано: 1');
  await search.fill('תודה');
  await page
    .getByRole('checkbox', { name: /^Выбрать для печати:/ })
    .first()
    .check();
  await expect(page.locator('[data-print-selection]')).toContainText('Выбрано: 2');
  await page.getByRole('button', { name: /По дате/ }).click();
  await page.getByRole('button', { name: 'Язык интерфейса' }).click();
  await page.getByRole('button', { name: 'Español', exact: true }).click();
  await expect(page.locator('[data-print-selection]')).toContainText('Seleccionadas: 2');
  await search.fill('ללמוד');
  await expect(
    page.getByRole('checkbox', { name: 'Seleccionar para imprimir: ללמוד', exact: true }),
  ).toBeChecked();
  await page.screenshot({ path: testInfo.outputPath('selection.png'), fullPage: true });
  await page.getByRole('button', { name: 'Borrar selección', exact: true }).click();
  await expect(page.locator('[data-print-selection]')).toBeHidden();
  await expect(
    page.getByRole('checkbox', { name: 'Seleccionar para imprimir: ללמוד', exact: true }),
  ).not.toBeChecked();
});

test('section toggles include unmounted cards and reflect partial selection in topic and date views', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.getByRole('button', { name: /^Выбрать все:/ }).first();
  const count = Number(await section.locator('..').locator('span').textContent());
  await page
    .getByRole('checkbox', { name: /^Выбрать для печати:/ })
    .first()
    .check();
  await expect(section).toHaveAttribute('aria-pressed', 'mixed');
  await section.click();
  await expect(page.locator('[data-print-selection]')).toContainText(`Выбрано: ${count}`);
  await page
    .getByRole('button', { name: /^Снять выбор:/ })
    .first()
    .click();
  await expect(page.locator('[data-print-selection]')).toBeHidden();
  await page.getByRole('button', { name: /По дате/ }).click();
  const dateSection = page.getByRole('button', { name: /^Выбрать все:/ }).first();
  const dateCount = Number(await dateSection.locator('..').locator('span').textContent());
  await dateSection.click();
  await expect(page.locator('[data-print-selection]')).toContainText(`Выбрано: ${dateCount}`);
  await page.getByRole('button', { name: 'Предпросмотр печати', exact: true }).click();
  await expect(page.getByRole('dialog').locator('[data-print-card]')).toHaveCount(dateCount);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('preview defaults, five-column layout, expanded grouping, font readiness and browser print', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.getByRole('checkbox', { name: 'Никуд', exact: true }).uncheck();
  await page.getByRole('checkbox', { name: 'Пропись', exact: true }).check();
  await page.getByRole('button', { name: /Все темы|По темам/ }).click();
  await page.getByRole('button', { name: 'Глаголы и состояния', exact: true }).click();
  const section = page.getByRole('button', {
    name: 'Выбрать все: Глаголы и состояния',
    exact: true,
  });
  const count = Number(await section.locator('..').locator('span').textContent());
  await section.click();
  await page.getByRole('button', { name: 'Предпросмотр печати', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('[data-print-card]')).toHaveCount(count);
  await expect(dialog.getByRole('checkbox', { name: 'Никуд', exact: true })).not.toBeChecked();
  await expect(dialog.getByRole('checkbox', { name: 'Пропись', exact: true })).toBeChecked();
  const expand = dialog.getByRole('checkbox', { name: 'Развернуть все карточки' });
  await expect(expand).not.toBeChecked();
  const print = dialog.getByRole('button', { name: 'Печать / Сохранить PDF' });
  await expect(print).toBeEnabled();
  expect(
    await dialog
      .locator('.print-card-row')
      .first()
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length),
  ).toBe(5);
  await dialog.getByRole('checkbox', { name: 'Никуд', exact: true }).check();
  await expect(dialog.locator('.print-card-hebrew').first()).toHaveText(/[\u0591-\u05c7]/);
  if (testInfo.project.name === 'desktop')
    await page.pdf({ path: testInfo.outputPath('compact.pdf'), preferCSSPageSize: true });
  await expand.check();
  await expect(dialog.locator('[data-expanded="true"]').first()).toBeVisible();
  const printKinds = await dialog
    .locator('[data-print-card]')
    .evaluateAll((cards) => cards.map((card) => card.getAttribute('data-expanded') === 'true'));
  expect(printKinds).toEqual([...printKinds].sort((a, b) => Number(b) - Number(a)));
  await dialog.getByRole('checkbox', { name: 'Пропись', exact: true }).uncheck();
  await expect(print).toBeEnabled();
  await page.screenshot({ path: testInfo.outputPath('preview.png') });
  if (testInfo.project.name === 'desktop')
    await page.pdf({ path: testInfo.outputPath('expanded.pdf'), preferCSSPageSize: true });
  if (testInfo.project.name === 'desktop')
    await page.pdf({
      path: testInfo.outputPath('expanded-with-headers.pdf'),
      preferCSSPageSize: true,
      displayHeaderFooter: true,
    });
  await page.evaluate(() => {
    window.print = () => document.body.setAttribute('data-print-invoked', 'true');
  });
  await print.click();
  await expect(page.locator('body')).toHaveAttribute('data-print-invoked', 'true');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#root')).toBeHidden();
  await expect(dialog.locator('.print-preview-controls')).toBeHidden();
  await expect(dialog).toHaveCSS('overflow', 'visible');
  await page.emulateMedia({ media: 'screen' });
  await dialog.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Никуд', exact: true })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Пропись', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Предпросмотр печати', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('checkbox', { name: 'Развернуть все карточки' }),
  ).not.toBeChecked();
});

test('compact-only selections hide the expansion setting', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('תודה');
  await page.getByRole('checkbox', { name: 'Выбрать для печати: תודה', exact: true }).check();
  await page.getByRole('button', { name: 'Предпросмотр печати', exact: true }).click();
  await expect(
    page.getByRole('dialog').getByRole('checkbox', { name: 'Развернуть все карточки' }),
  ).toHaveCount(0);
});

test('the complete expanded dictionary fits within printable row dimensions in both languages', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Physical print dimensions do not depend on the screen size.',
  );
  await page.goto('/');
  const core = (await (
    await page.request.get('/src/data/dictionary.core.json')
  ).json()) as DictionaryData;
  const ru = (await (
    await page.request.get('/src/data/dictionary.ru.json')
  ).json()) as DictionaryLocalization;
  for (const section of core.sections) {
    await page
      .getByRole('button', { name: /Все темы|По темам/ })
      .or(page.locator('[data-topic-trigger]'))
      .click();
    await page.getByRole('button', { name: ru.sections[section.id].title, exact: true }).click();
    await page
      .getByRole('button', { name: `Выбрать все: ${ru.sections[section.id].title}`, exact: true })
      .click();
  }
  const count = core.sections.reduce((total, section) => total + section.entries.length, 0);
  for (const locale of ['ru', 'es'] as const) {
    if (locale === 'es') {
      await page.getByRole('button', { name: 'Язык интерфейса' }).click();
      await page.getByRole('button', { name: 'Español', exact: true }).click();
    }
    await page
      .getByRole('button', {
        name: locale === 'ru' ? 'Предпросмотр печати' : 'Vista previa de impresión',
        exact: true,
      })
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('[data-print-card]')).toHaveCount(count);
    await dialog
      .getByRole('checkbox', {
        name: locale === 'ru' ? 'Развернуть все карточки' : 'Expandir todas las tarjetas',
      })
      .check();
    for (const handwriting of [false, true]) {
      await dialog
        .getByRole('checkbox', { name: locale === 'ru' ? 'Пропись' : 'Manuscrita', exact: true })
        .setChecked(handwriting);
      await expect(dialog.getByRole('button', { name: /PDF/ })).toBeEnabled();
      const heights = await dialog
        .locator('.print-card-row')
        .evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().height));
      // A4 portrait minus two 15 mm margins, at 96 CSS px per inch.
      expect(
        Math.max(...heights),
        JSON.stringify(
          await dialog.locator('.print-card-row').evaluateAll((rows) =>
            rows
              .filter((row) => row.getBoundingClientRect().height > 1000)
              .map((row) => ({
                height: row.getBoundingClientRect().height,
                cards: [...row.children].map((card) => card.getAttribute('data-print-card')),
              })),
          ),
        ),
      ).toBeLessThan((267 * 96) / 25.4);
    }
    await page.pdf({
      path: testInfo.outputPath(`dense-${locale}.pdf`),
      preferCSSPageSize: true,
      pageRanges: '1',
    });
    await dialog
      .getByRole('button', { name: locale === 'ru' ? 'Закрыть' : 'Cerrar', exact: true })
      .click();
  }
});
