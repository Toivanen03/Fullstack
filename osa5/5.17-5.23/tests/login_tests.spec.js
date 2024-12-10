// @ts-check
// @ts-ignore

const { test, describe, expect, beforeEach, afterEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app login:', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
        data: {
            name: 'Matti Mäyrä',
            username: 'Masa',
            password: 'EtIkunaArvaa'
            }
        })
        await page.goto('/')
    })

    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Masa', 'EtIkunaArvaa')
        await page.getByRole('button', { name: 'login' }).click() 
        await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
    })

    describe('fails with wrong credentials:', () => {
        test('password;', async ({ page }) => {
            await loginWith(page, 'Masa', 'YritinArvataMuttaMeniVäärin')
        })

        test('username;', async ({ page }) => {
            await loginWith(page, 'Matti', 'EtIkunaArvaa')
        })

        afterEach(async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click()
            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(page.getByText('logged in')).not.toBeVisible()
        })
    })
})