---
title: "Playwright Testing"
aliases: ["Playwright", "Playwright E2E", "Playwright TypeScript"]
tags: [QA, Testing, UITesting, Playwright, E2E, TypeScript]
domain: QA Testing
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Playwright Testing

> [!abstract] TL;DR
> Playwright is Microsoft's modern browser automation library with built-in TypeScript support, automatic waits (no `sleep` needed), network interception, and pixel-perfect visual comparisons. It ships Chrome, Firefox, and WebKit in a single install. Semantic locators (`getByRole`, `getByLabel`, `getByText`) make tests readable and resilient. Browser contexts provide complete session isolation per test. The trace viewer gives video + timeline debugging for CI failures.

---

## Why Playwright Over Selenium

| Feature | Playwright | Selenium |
|---------|-----------|---------|
| Auto-wait | Built-in (waits for actionability) | Manual explicit waits |
| Network interception | `page.route()` — native | CDP only (Chrome) |
| Browser install | `npx playwright install` (all 3 engines) | Separate driver per browser |
| TypeScript | First-class, zero config | Third-party |
| Visual comparison | `toHaveScreenshot()` built-in | External library |
| Test isolation | Browser context per test | Manual state reset |
| Trace viewer | Built-in | None |
| Speed | Faster (fewer round-trips) | Slower |
| Maturity | 2020+ | 2011+ |

---

## Installation and Setup

```bash
# Install
npm init playwright@latest

# Install browsers
npx playwright install
npx playwright install --with-deps  # also installs OS dependencies (CI)

# Project structure
playwright.config.ts
tests/
  auth.spec.ts
  checkout.spec.ts
  visual.spec.ts
test-results/          # screenshots on failure
playwright-report/     # HTML report
```

**`playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,            // per-test timeout
    retries: process.env.CI ? 2 : 0,   // retry flaky tests in CI
    workers: process.env.CI ? 4 : undefined,

    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',     // capture trace on first retry
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
        { name: 'mobile',   use: { ...devices['iPhone 14'] } },
    ],
});
```

---

## Core Test Structure

```typescript
import { test, expect } from '@playwright/test';

// test.describe groups related tests
test.describe('User Authentication', () => {

    // Runs before each test in this describe block
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('successful login redirects to dashboard', async ({ page }) => {
        // Semantic locators — find by how users see the element
        await page.getByLabel('Email address').fill('alice@example.com');
        await page.getByLabel('Password').fill('SecurePass123');
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Assertions — auto-waits until condition is met or timeout
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByRole('heading', { name: 'Welcome, Alice' })).toBeVisible();
        await expect(page.getByTestId('user-avatar')).toBeVisible();
    });

    test('invalid credentials shows error', async ({ page }) => {
        await page.getByLabel('Email address').fill('alice@example.com');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: 'Sign in' }).click();

        await expect(page.getByRole('alert')).toContainText('Invalid credentials');
        await expect(page).toHaveURL('/login');  // stays on login page
    });

    test('empty form shows validation errors', async ({ page }) => {
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Multiple assertions — all checked
        await expect(page.getByText('Email is required')).toBeVisible();
        await expect(page.getByText('Password is required')).toBeVisible();
    });
});
```

---

## Locator API — Semantic-First

```typescript
// Preferred: semantic locators (accessibility-first)
page.getByRole('button', { name: 'Submit' })        // ARIA role
page.getByLabel('Email address')                      // form label
page.getByPlaceholder('Enter your email')             // placeholder
page.getByText('Welcome back')                        // visible text
page.getByAltText('Company logo')                     // img alt
page.getByTitle('Delete item')                        // title attribute
page.getByTestId('checkout-submit')                   // data-testid

// Chaining locators for precision
page.getByRole('listitem').filter({ hasText: 'Alice' })
    .getByRole('button', { name: 'Edit' })

// nth() for repeated elements
page.getByRole('row').nth(2)                          // 3rd row (0-indexed)
page.getByRole('listitem').filter({ hasText: 'Laptop' }).first()

// Avoid: fragile CSS/XPath selectors
// page.locator('#form > div:nth-child(2) > input')   // fragile
// page.locator('xpath=//button[contains(@class,"btn")]')  // fragile
```

---

## Network Interception

```typescript
test('shows error when API is down', async ({ page }) => {
    // Mock API to return 503
    await page.route('**/api/orders', route =>
        route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Service Unavailable' })
        })
    );

    await page.goto('/checkout');
    await expect(page.getByText('Service temporarily unavailable')).toBeVisible();
});

test('intercept and modify response', async ({ page }) => {
    await page.route('**/api/products/**', async route => {
        const response = await route.fetch();           // let request through
        const json = await response.json();
        json.price = 0;                                 // modify the response
        await route.fulfill({ json });
    });
});

test('abort image requests for faster loading', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    await page.goto('/');
});

// Wait for a specific API call and assert on it
test('checkout sends correct payload', async ({ page }) => {
    const orderRequest = page.waitForRequest(req =>
        req.url().includes('/api/orders') && req.method() === 'POST'
    );

    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Place Order' }).click();

    const req = await orderRequest;
    const body = req.postDataJSON();
    expect(body.items).toHaveLength(2);
    expect(body.currency).toBe('USD');
});
```

---

## Visual Comparison (Screenshot Testing)

```typescript
test('checkout page matches snapshot', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Full page screenshot comparison
    await expect(page).toHaveScreenshot('checkout-page.png', {
        maxDiffPixels: 100,          // allow minor anti-aliasing differences
        threshold: 0.1,              // pixel similarity threshold (0–1)
    });
});

test('product card component snapshot', async ({ page }) => {
    await page.goto('/products');
    const card = page.getByTestId('product-card').first();

    // Element-level screenshot
    await expect(card).toHaveScreenshot('product-card.png');
});

// Update snapshots: npx playwright test --update-snapshots
```

---

## Browser Contexts for Isolation

```typescript
// Each test gets a fresh browser context (no cookie/session sharing)
// This is the default in Playwright — no manual cleanup needed

// Custom fixture: pre-authenticated context
import { test as base } from '@playwright/test';

type AuthFixtures = { authenticatedPage: Page };

const test = base.extend<AuthFixtures>({
    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json'  // saved session
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    }
});

// Save auth state once
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/login');
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await context.storageState({ path: 'playwright/.auth/user.json' });
    await context.close();
});
```

---

## Playwright Codegen

```bash
# Record interactions — generates TypeScript test code
npx playwright codegen https://example.com

# Codegen with mobile emulation
npx playwright codegen --device="iPhone 14" https://example.com

# Codegen and save to file
npx playwright codegen --target=playwright-test -o tests/recorded.spec.ts https://example.com
```

---

## Trace Viewer and Debugging

```bash
# Run and capture trace
npx playwright test --trace on

# Open trace viewer (video + timeline + DOM snapshots)
npx playwright show-trace test-results/auth-login/trace.zip

# Debug mode — pauses at each step
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test tests/auth.spec.ts --grep "successful login"
```

---

## CI Integration

```yaml
# .github/workflows/e2e.yml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright Tests
  run: npx playwright test
  env:
    BASE_URL: https://staging.example.com

- name: Upload test report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

---

## Common Pitfalls

1. **Using CSS selectors for locators** — `page.locator('.btn-primary')` breaks when CSS changes; use `getByRole`/`getByLabel`/`getByTestId` for resilience
2. **`page.waitForTimeout(3000)`** — this is Playwright's version of `Thread.sleep`; replace with `waitForLoadState`, `waitForResponse`, or assertion auto-wait
3. **Not using browser contexts for auth** — logging in before every test is slow; save storage state once and reuse the context
4. **Hardcoded base URLs** — always use `baseURL` from config and process environment; hard-coding breaks multi-environment usage
5. **Ignoring trace files** — `trace: 'on-first-retry'` is your best CI debugging tool; without it, diagnosing intermittent failures is extremely difficult

---

## Review Questions

1. What is the difference between `page.getByRole('button', {name: 'Submit'})` and `page.locator('button.submit')`? Why is the former preferred?
2. How does Playwright's auto-wait mechanism work? What does it wait for before `click()`?
3. Write a test that intercepts `POST /api/checkout` and returns a 500 error, verifying the UI displays an appropriate error message.
4. How would you share authenticated browser state across tests without logging in before every test?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[Selenium_and_WebDriver]]
- [[Cypress_Testing]]
- [[CI_CD_Testing_Integration]]

---

#QA #Testing #Playwright #E2E #UITesting
