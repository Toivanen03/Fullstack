// @ts-check
// @ts-ignore
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Create and like blog:', () => {
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

  test('a new blog can be created', async ({ page }) => {
    await expect(page.getByText('Kuinka testata testejä?')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await expect(page.getByText('Kuinka testata testejä?')).toBeVisible()

    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByTestId('likes-count')).toBeVisible()

    await page.getByRole('button', { name: 'like' }).click()
    await page.waitForSelector('text=Likes: 1')

    await expect(page.getByText('Tykätty!')).toBeVisible()
  })
})