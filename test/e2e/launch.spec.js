const { expect, test } = require('@playwright/test')
const { launchElectron } = require('./helpers')

test.describe('Check Launch JsMarkNote', () => {
  let app = null
  let page = null

  test.beforeAll(async() => {
    const { app: electronApp, page: firstPage } = await launchElectron()
    app = electronApp
    page = firstPage
  })

  test.afterAll(async() => {
    await app.close()
  })

  test('Empty JsMarkNote', async() => {
    const title = await page.title()
    expect(/^JsMarkNote|Untitled-1 - JsMarkNote$/.test(title)).toBeTruthy()
  })
})
