/* eslint-env jest */
const score = require.requireActual('../models/score')
const db = require.requireActual('../models/database')

let scoreInst
beforeAll(async () => {
  await db.executeQuery(
    `INSERT INTO public."QUIZ_CATEGORY" ` +
    `VALUES ($1, $2);`, ['1', 'TEST']
  ).then(result => {
    return result
  })
})

afterAll(async () => {
  await db.executeQuery(
    `DELETE FROM public."QUIZ_CATEGORY" WHERE "CATEGORY_NAME" = $1`,
    ['TEST']
  ).then(result => {
    return result
  })
})
beforeEach(() => {
  scoreInst = new score.Score()
})

afterEach(() => {
  scoreInst = undefined
})

describe.skip('Testing Score', () => {
  it('should return an object of score attributes', () => {
    expect(scoreInst.toJSON()).toEqual({
      userScore: expect.anything(),
      currentStreak: expect.anything(),
      highestStreak: expect.anything()
    })
  })

  it('should resolve HTML', async () => {
    expect(await scoreInst.getLeaderboardStats()).resolves.toBeTruthy()
  })
})