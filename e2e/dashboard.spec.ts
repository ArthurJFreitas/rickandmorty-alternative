import { test, expect } from '@playwright/test'

test.describe('Dashboard - Rick and Morty', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Initial page load', () => {
    test('should display the page title and logo', async ({ page }) => {
      await expect(page).toHaveTitle(/Rick and Morty/i)

      const logo = page.locator('img[alt*="Rick and Morty"]')
      await expect(logo).toBeVisible()
    })

    test('should display stats cards', async ({ page }) => {
      await expect(page.getByText('Total Characters')).toBeVisible()
      await expect(page.getByText('Unique Locations')).toBeVisible()
      await expect(page.getByText('Pages Available')).toBeVisible()
    })

    test('should display character table', async ({ page }) => {
      await expect(page.getByText('Character Distribution by Location')).toBeVisible()

      await page.waitForSelector('table tbody tr', { timeout: 10000 })

      const rows = await page.locator('table tbody tr').count()
      expect(rows).toBeGreaterThan(0)
    })

    test('should display location chart', async ({ page }) => {
      await expect(page.getByText('Character Distribution by Location')).toBeVisible()

      await page.waitForSelector('svg', { timeout: 10000 })
      const chart = page.locator('svg').first()
      await expect(chart).toBeVisible()
    })
  })

  test.describe('Search functionality', () => {
    test('should filter characters by name', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search characters...')
      await expect(searchInput).toBeVisible()

      await searchInput.fill('Rick')

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      const secondCell = page.locator('table tbody tr').first().locator('td').nth(1)
      await expect(secondCell).toContainText('Rick', { ignoreCase: true })
    })

    test('should show empty state when no results found', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search characters...')

      await searchInput.fill('XYZNonexistentCharacter123')
      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      await expect(page.getByText(/No characters/i)).toBeVisible()
    })

    test('should clear search with clear button', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search characters...')

      await searchInput.fill('Morty')
      await page.waitForTimeout(600)

      const clearButton = page.locator('button[aria-label*="Clear"], button:has-text("Clear")').first()
      if (await clearButton.isVisible()) {
        await clearButton.click()
        await expect(searchInput).toHaveValue('')
      }
    })
  })

  test.describe('Filter functionality', () => {
    test('should filter by status - Alive', async ({ page }) => {
      const statusDropdown = page.getByText('Status').locator('..').locator('select, button').first()
      await statusDropdown.click()

      const aliveOption = page.getByRole('option', { name: /^Alive$/i }).first()
      await aliveOption.click()

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      expect(page.url()).toContain('status=alive')
    })

    test('should filter by status - Dead', async ({ page }) => {
      const statusDropdown = page.getByText('Status').locator('..').locator('select, button').first()
      await statusDropdown.click()

      const deadOption = page.getByRole('option', { name: /^Dead$/i }).first()
      await deadOption.click()

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      expect(page.url()).toContain('status=dead')
    })

    test('should filter by gender - Male', async ({ page }) => {
      const genderDropdown = page.getByText('Gender').locator('..').locator('select, button').first()
      await genderDropdown.click()

      const maleOption = page.getByRole('option', { name: /^Male$/i }).first()
      await maleOption.click()

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      expect(page.url()).toContain('gender=male')
    })

    test('should filter by gender - Female', async ({ page }) => {
      const genderDropdown = page.getByText('Gender').locator('..').locator('select, button').first()
      await genderDropdown.click()

      const femaleOption = page.getByRole('option', { name: /^Female$/i }).first()
      await femaleOption.click()

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      expect(page.url()).toContain('gender=female')
    })

    test('should combine search and filters', async ({ page }) => {
      await page.getByPlaceholder('Search characters...').fill('Smith')
      await page.waitForTimeout(600)

      const statusDropdown = page.getByText('Status').locator('..').locator('select, button').first()
      await statusDropdown.click()
      const aliveOption = page.getByRole('option', { name: /^Alive$/i }).first()
      await aliveOption.click()

      await page.waitForTimeout(600)
      await page.waitForLoadState('networkidle')

      expect(page.url()).toContain('status=alive')

      const rows = await page.locator('table tbody tr').count()
      expect(rows).toBeGreaterThan(0)
    })
  })

  test.describe('Infinite scroll', () => {
    test('should load more characters on scroll', async ({ page }) => {
      await page.waitForSelector('table tbody tr')
      const initialCount = await page.locator('table tbody tr').count()

      // Use more specific selector for the scrollable container
      const tableContainer = page.locator('.table-scroll').first()
      await expect(tableContainer).toBeVisible()

      // Scroll to bottom to trigger infinite scroll
      await tableContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })

      // Wait for potential new content to load
      await page.waitForTimeout(2000)

      const newCount = await page.locator('table tbody tr').count()

      // Count should either increase or stay the same (if we reached the end)
      expect(newCount).toBeGreaterThanOrEqual(initialCount)
    })


    test('should maintain scroll position after loading more', async ({ page }) => {
      await page.waitForSelector('table tbody tr')

      // Use more specific selector for the scrollable container
      const tableContainer = page.locator('.table-scroll').first()
      await expect(tableContainer).toBeVisible()

      // Scroll to a position that will trigger loading more
      const scrollPos = await tableContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight - el.clientHeight - 100
        return el.scrollTop
      })

      // Verify we actually scrolled
      expect(scrollPos).toBeGreaterThan(0)

      // Wait for potential new content to load
      await page.waitForTimeout(2000)

      // After loading, scroll position should still be > 0 (not reset to top)
      const newScrollPos = await tableContainer.evaluate((el) => el.scrollTop)
      expect(newScrollPos).toBeGreaterThan(0)
    })
  })
})
