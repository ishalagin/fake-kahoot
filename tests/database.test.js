/* eslint-env jest */
const db = require.requireActual('../models/database')

beforeAll(() => {
  return undefined
})

afterAll(() => {
  return undefined
})

beforeEach(() => {
  return undefined
})

afterEach(() => {
  return undefined
})

describe('executeQuery() tests', () => {
  test('test executeQuery with SELECT', async () => {
    await db.executeQuery('SELECT * FROM public."ACCOUNTS";', []).then(result => {
      expect(result).toBeTruthy()
    })
  })

  test('test executeQuery with empty string', async () => {
    await db.executeQuery('', []).then(result => {
      expect(result).toBeTruthy()
    })
  })

  test('test executeQuery with empty', async () => {
    await db.executeQuery('adsf', []).then(result => {
      expect(result).toBeTruthy()
    }).catch(error => {
      expect(error.message).toBe(`syntax error at or near \"adsf\"`)
    })
  })
})
