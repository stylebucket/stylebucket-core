import type { Browser, Page } from 'playwright';
import type { PreviewServer } from 'vite';

import { preview } from 'vite';
import { chromium } from 'playwright';
import { expect } from 'vitest';

import {
  beforeAll,
  afterAll,
  describe,
  test,
} from 'vitest';

import { classNames } from './src/main.style';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

describe('Stylebucket Vite Plugin', async () => {

  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: PORT } });
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ baseURL: BASE_URL });
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve());
    })
  });

  test('Homepage background should be green', async () => {
    await page.goto('/');
    const main = page.getByRole('main');
    const bgColor = await main.evaluate((el) => {
      return (
        window
          .getComputedStyle(el)
          .getPropertyValue('background-color')
      );
    });
    // solid green is rgb(0, 128, 0);
    expect(bgColor).toBe('rgb(0, 128, 0)');
  })

  test('Homepage heading is correct styling', async () =>{
    await page.goto('/');
    const { heading } = classNames;
    const h1 = page.locator(heading.selector);
    await h1.waitFor();
    const textSize = await h1.evaluate((el) => {
      return (
        window
          .getComputedStyle(el)
          .getPropertyValue('font-size')
      );
    });
    // Unresolved value is 3rem
    expect(textSize).toBe('48px');
  });

});

