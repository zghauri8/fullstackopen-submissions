import { test, expect } from '@playwright/test'

const api = 'http://localhost:3003'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post(`${api}/api/testing/reset`)
    await request.post(`${api}/api/users`, {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' },
    })
    await page.goto('/')
  })

  test('Login form is shown (5.17)', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login (5.18)', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username/password')).toBeVisible()
    })
  })

  test.describe('When logged in (5.19–5.23)', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created (5.19)', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('The Joel Test')
      await page.getByLabel(/author/i).fill('Joel Spolsky')
      await page.getByLabel(/url/i).fill('https://example.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('The Joel Test Joel Spolsky')).toBeVisible()
    })

    test('blog can be liked (5.20)', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Like me')
      await page.getByLabel(/author/i).fill('A')
      await page.getByLabel(/url/i).fill('http://x')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.getByText('Like me A').locator('..') // parent container
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('creator can delete blog (5.21)', async ({ page }) => {
      // create
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Remove me')
      await page.getByLabel(/author/i).fill('B')
      await page.getByLabel(/url/i).fill('http://y')
      await page.getByRole('button', { name: 'create' }).click()

      page.on('dialog', dialog => dialog.accept())
      const blog = page.getByText('Remove me B').locator('..')
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Remove me B')).not.toBeVisible()
    })

    test('only creator sees delete button (5.22)', async ({ page, request }) => {
      // create by mluukkai
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('Owned')
      await page.getByLabel(/author/i).fill('Owner')
      await page.getByLabel(/url/i).fill('http://o')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Owned Owner')).toBeVisible()

      // new user
      await request.post(`${api}/api/users`, {
        data: { name: 'Other', username: 'other', password: 'pass' },
      })
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByLabel('username').fill('other')
      await page.getByLabel('password').fill('pass')
      await page.getByRole('button', { name: 'login' }).click()

      const blog = page.getByText('Owned Owner').locator('..')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes (5.23)', async ({ page }) => {
      const create = async (t, a) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel(/title/i).fill(t)
        await page.getByLabel(/author/i).fill(a)
        await page.getByLabel(/url/i).fill('http://z')
        await page.getByRole('button', { name: 'create' }).click()
      }
      await create('A', 'a')
      await create('B', 'b')
      await create('C', 'c')

      const like = async (title, n) => {
        const blog = page.getByText(new RegExp(`^${title}\\s`)).locator('..')
        await blog.getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < n; i++) await blog.getByRole('button', { name: 'like' }).click()
      }
      await like('A', 2)
      await like('B', 5)
      await like('C', 1)

      const items = await page.locator('.blog').allTextContents()
      // expect order: B, A, C
      expect(items[0]).toMatch(/B b/)
      expect(items[1]).toMatch(/A a/)
      expect(items[2]).toMatch(/C c/)
    })
  })
})