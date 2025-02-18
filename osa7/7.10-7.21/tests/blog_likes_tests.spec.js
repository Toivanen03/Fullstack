// @ts-check
// @ts-ignore

const { test, expect, describe, beforeEach, afterEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Check that blogs are in descending order by likes:', () => {
    test('1: Format database and add a user', async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Mäyrä',
                username: 'Masa',
                password: 'EtIkunaArvaa'
            }
        })
    })

    describe('2: add blogs:', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/')
            await loginWith(page, 'Masa', 'EtIkunaArvaa')
            await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
            await page.getByRole('button', { name: 'new blog' }).click()
        })

        test('1st blog:', async ({ page }) => {
            await page.getByTestId('title').fill('Blogi 1')
            await page.getByTestId('author').fill('Tauno Testaaja')
            await page.getByTestId('url').fill('www.blogi1.fi')
        })

        test('2nd blog:', async ({ page }) => {
            await page.getByTestId('title').fill('Blogi 2')
            await page.getByTestId('author').fill('Tauno Testaaja')
            await page.getByTestId('url').fill('www.blogi2.fi')
        })

        test('3rd blog:', async ({ page }) => {
            await page.getByTestId('title').fill('Blogi 3')
            await page.getByTestId('author').fill('Tauno Testaaja')
            await page.getByTestId('url').fill('www.blogi3.fi')
        })

        afterEach(async ({ page }) => {
            await page.getByRole('button', { name: 'send' }).click()
        })
    })

    describe('3: add 5 likes to 1st blog:', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/')
            await loginWith(page, 'Masa', 'EtIkunaArvaa')
            await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
            const blog1 = page.locator('.blogStyle').filter({ hasText: 'Blogi 1' })
            await blog1.locator('button', { hasText: 'view' }).click()
            await blog1.locator('button', { hasText: 'Like' }).click()
        })

        test('1st like:', async () => {
        })

        test('2nd like:', async () => {
        })

        test('3rd like:', async () => {
        })

        test('4th like:', async () => {
        })

        test('5th like:', async () => {
        })
    })

    describe('4: add 5 likes to 2nd blog:', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/')
            await loginWith(page, 'Masa', 'EtIkunaArvaa')
            await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
            const blog2 = page.locator('.blogStyle').filter({ hasText: 'Blogi 2' })
            await blog2.locator('button', { hasText: 'view' }).click()
            await blog2.locator('button', { hasText: 'Like' }).click()
        })

        test('1st like:', async () => {
        })

        test('2nd like:', async () => {
        })

        test('3rd like:', async () => {
        })
    })

    describe('5: add 10 likes to 3rd blog:', () => {
        beforeEach(async ({ page }) => {
            await page.goto('/')
            await loginWith(page, 'Masa', 'EtIkunaArvaa')
            await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
            const blog3 = page.locator('.blogStyle').filter({ hasText: 'Blogi 3' })
            await blog3.locator('button', { hasText: 'view' }).click()
            await blog3.locator('button', { hasText: 'Like' }).click()
        })

        test('1st like:', async () => {
        })

        test('2nd like:', async () => {
        })

        test('3rd like:', async () => {
        })

        test('4th like:', async () => {
        })

        test('5th like:', async () => {
        })

        test('6th like:', async () => {
        })

        test('7th like:', async () => {
        })

        test('8th like:', async () => {
        })

        test('9th like:', async () => {
        })

        test('10th like:', async () => {
        })
    })
})

test('6: confirm blog order', async ({ page }) => {
    const blogElements = page.locator('.blogStyle')
    const likes = await blogElements.allTextContents()

    const likeCounts = likes.map(like => {
        const match = like.match(/Likes: (\d+)/)
        return match ? parseInt(match[1], 10) : 0
    })

    expect(likeCounts).toEqual(likeCounts.sort((a, b) => b - a))
})