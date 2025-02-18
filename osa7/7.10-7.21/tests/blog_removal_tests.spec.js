// @ts-check
// @ts-ignore

const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog removal:', () => {
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

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Kuinka testata testejä?')
        await page.getByTestId('author').fill('Tauno Testaaja')
        await page.getByTestId('url').fill('www.testi.fi')
        await page.getByRole('button', { name: 'send' }).click()
    })
  
    test('user can delete a blog', async ({ page }) => {
        await expect(page.getByText('Kuinka testata testejä?')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'Remove blog' }).click()

        page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toBe('Haluatko varmasti poistaa blogin Kuinka testata testejä??')
        await dialog.accept()
        })
  
        await page.getByRole('button', { name: 'Remove blog' }).click()
        await expect(page.locator('.blogStyle').filter({ hasText: '/testata testejä/i' })).not.toBeVisible()
        await expect(page.getByText('Blogi poistettu')).toBeVisible()
    })
  
    test('only blog publisher sees the remove button', async ({ page, request }) => {
        await request.post('/api/users', {
            data: {
            name: 'Matias Mäyrä',
            username: 'MasaKaks',
            password: 'EtIkunaArvaaTätäkään'
            }
        })

        await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()

        await expect(page.getByText('Kuinka testata testejä?')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', {name: 'Remove blog'})).toBeVisible()

        await page.getByRole('button', { name: 'Log out' }).click()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

        await loginWith(page, 'MasaKaks', 'EtIkunaArvaaTätäkään')
        await expect(page.getByText('Matias Mäyrä logged in')).toBeVisible()

        await expect(page.getByText('Kuinka testata testejä?')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', {name: 'Remove blog'})).not.toBeVisible()
    })
})