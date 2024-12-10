const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createNote = async (page, content, important) => {
    await page.getByRole('button', { name: 'new note' }).click()
    await page.getByRole('textbox').fill(content, important)
    await page.getByRole('button', { name: 'save' }).click()
    await page.getByText(content).waitFor()
  }
  
  export { loginWith, createNote }