/* eslint-env jest */
const db = require('../models/database')
beforeAll(() => {
  return undefined
})

afterAll(() => {
  return undefined
})

/**
 * If beforeEach is inside a describe block, it runs for each test in the describe block.
 */
beforeEach(() => {
  return undefined
})

/**
 * If afterEach is inside a describe block, it runs for each test in the describe block.
 */
afterEach(() => {
  return undefined
})

test('test executeQuery with SELECT', async () => {
  await expect(db.executeQuery('SELECT * FROM public."ACCOUNTS";')).toBeTruthy()
})

test('test executeQuery with INSERT', async () => {
  await expect(db.executeQuery('INSERT')).toBeTruthy()
})