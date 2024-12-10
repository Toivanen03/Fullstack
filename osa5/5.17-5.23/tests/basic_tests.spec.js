// @ts-check
// @ts-ignore
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog basic tests:', () => {
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
        await loginWith(page, 'Masa', 'EtIkunaArvaa')
        await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
    })

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'Log out' }).click()
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })
})