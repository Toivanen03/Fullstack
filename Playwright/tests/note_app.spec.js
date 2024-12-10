// @ts-check
// @ts-ignore
const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
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

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('Masa')
    await page.getByTestId('password').fill('EtIkunaArvaa')
  
    await page.getByRole('button', { name: 'login' }).click() 
  
    await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill('Masa')
    await page.getByTestId('password').fill('YritinArvataMuttaMeniVäärin')
    await page.getByRole('button', { name: 'login' }).click()
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Väärä tunnus tai salasana')
    await expect(page.getByText('Matti Mäyrä logged in')).not.toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'Masa', 'EtIkunaArvaa')
    await expect(page.getByText('Matti Mäyrä logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Masa', 'EtIkunaArvaa')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = page.getByText('first note')
        const otherNoteElement = otherNoteText.locator('..')
  
        await otherNoteElement
          .getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })

      test('second note importance can be changed', async ({ page }) => {
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})